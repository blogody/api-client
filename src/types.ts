export interface Tag {
  id: string
  name: string
  slug: string
}

export interface Author {
  id: string
  name: string
  slug: string
}

export interface TagRelation {
  id: number
  sort: number
  tag: Tag
}

export type AuthorRelation = {
  id: number
  sort: number
  author: Author
}

export enum PostType {
  Page = 'PAGE',
  Post = 'POST',
}

export interface Post {
  id: string
  slug: string
  title: string
  featureImage: string
  html: string
  excerpt: string
  type: PostType
  tagRelations: TagRelation[]
  authorRelations: AuthorRelation[]
  publishedAt: Date
}

export type Page = Post

export type PostOrPage = Post | Page

export interface Navigation {
  sort: number
  label: string
  url: string
}

export type Social = Navigation

export interface Settings {
  title: string
  description: string
  lang: string
  navigations: Navigation[]
  socials: Social[]
}

type PostSlugProjectIdCompoundUniqueInput = {
  slug: string
  projectId: string
}

type PostIdUserIdCompoundUniqueInput = {
  id: string
  userId: string
}

export type PostWhereUniqueInput = {
  slug_projectId?: PostSlugProjectIdCompoundUniqueInput
  id_userId?: PostIdUserIdCompoundUniqueInput
}

export type PageWhereUniqueInput = PostWhereUniqueInput
