import cron from 'node-cron'
import { Post } from '../models/Post.js'
import { Account } from '../models/Account.js'
import zernio from '../config/zernio.js'
import { ActivityLog } from '../models/ActivityLog.js'

export const initScheduler = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date()
            const postsToPublish = await Post.find({
                status: "scheduled",
                scheduledFor: { $lte: now }  // fix 1: $1te → $lte
            })

            for (const post of postsToPublish) {  // fix 2: element/object → post/postsToPublish
                try {
                    const accounts = await Account.find({
                        user: post.user,
                        platform: { $in: post.platforms },
                        status: "connnected",
                        zernioAccountId: { $exists: true }
                    })

                    if (accounts.length === 0) {
                        console.log(`No connected Zernio accounts found for post ${post._id}`)  // fix 6: Post → post
                        continue;
                    }

                    const zernioPlatform = accounts.map((acc) => ({
                        platform: acc.platform as any,  // fix 3: tform → platform, fix 5: semicolon → comma
                        accountId: acc.zernioAccountId as string  // fix 4: narrowed to string
                    }))

                    const payload = {
                        content: post.content,
                        publishNow: true,
                        ...(post.mediaUrl
                            ? { mediaItems: [{ type: post.mediaType || "image", url: post.mediaUrl }] }  // fix 6: Post.mediaType → post.mediaType
                            : {}),
                        platform: zernioPlatform,
                    }

                    console.log(`Publishing post ${post._id} to Zernio with media: ${post.mediaUrl || "none"}`)  // fix 7: postsToPublish._id → post._id

                    const response = await zernio.posts.createPost({ body: payload })
                    const publishedPost = (response.data as any)?.post || response.data;

                    if (!publishedPost) {
                        throw new Error("Failed to get post object from Zernio response")
                    }

                    console.log(`Zernio post created: ${publishedPost._id || publishedPost.id}`)

                    // fix 8: update post fields before saving on success
                    post.status = "published"
                    post.zernioPostId = publishedPost._id || publishedPost.id
                    await post.save()

                    await ActivityLog.create({
                        user: post.user,
                        actionType: "POST_PUBLISHED",
                        description: `Published post to ${accounts.map((a) => a.platform).join(",")}`,
                        relatedPost: post._id,
                    } as any)
                } catch (err: any) {
                    console.error(`Failed to publish post ${post._id}:`, err?.response?.data || err?.message)
                    post.status = "failed"
                    await post.save()  // fix 9: Post.save() → post.save()
                }
            }

            // fix 10: moved outside the for-loop
            if (postsToPublish.length > 0) {
                console.log(`Evaluated ${postsToPublish.length} posts at ${now.toISOString()}`)
            }

        } catch (error) {
            console.error("Error in scheduler:", error)
        }
    })

    console.log("Scheduler service initialized")
}