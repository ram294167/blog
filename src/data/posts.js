import 'server-only'
import { unstable_cache as cache } from 'next/cache'
import { Post } from '@/db/models'

export async function createPost(userId, { title, contents, isPublic = false }) {
  const post = new Post({ author: userId, title, contents, isPublic })
  return await post.save()
}

export const listPublicPosts = cache(
  async function listPublicPosts() {
    return await Post.find({ isPublic: true })
      .sort({ createdAt: 'descending' })
      .populate('author', 'username')
      .lean()
  },
  ['posts', 'listPublicPosts'],
  { tags: ['posts'] },
)

export async function listVisiblePosts(userId) {
  if (!userId) {
    return await listPublicPosts()
  }

  return await Post.find({
    $or: [
      { isPublic: true },
      { author: userId },
    ],
  })
    .sort({ createdAt: 'descending' })
    .populate('author', 'username')
    .lean()
}

export const getPostById = cache(
  async function getPostById(postId) {
    return await Post.findById(postId).populate('author', 'username').lean()
  },
  ['posts', 'getPostById'],
)

export async function getVisiblePostById(postId, userId) {
  if (!userId) {
    return await Post.findOne({ _id: postId, isPublic: true })
      .populate('author', 'username')
      .lean()
  }

  return await Post.findOne({
    _id: postId,
    $or: [
      { isPublic: true },
      { author: userId },
    ],
  })
    .populate('author', 'username')
    .lean()
}
