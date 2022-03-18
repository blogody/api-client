import { Client, createClient } from '@urql/core'

import {
  User,
  Settings,
  Tag,
  Author,
  Post,
  Page,
  PostOrPage,
  PostWhereUniqueInput,
  PageWhereUniqueInput,
  Member,
} from './types'

import {
  userQuery,
  allSettingsQuery,
  allPostsQuery,
  allPagesQuery,
  allTagsQuery,
  allAuthorsQuery,
  postQuery,
  pageQuery,
  confirmOneMemberMutation,
  unsubscribeOneMemberMutation,
  emailOpenedOneMemberMutation,
} from './queries.js'

interface HostOptions {
  host: string
  custom?: string
}

interface GetProjectOrCustomDomainResult {
  project: string
  domain: string
}

interface PostsOrPagesOptions {
  limit?: number
  tag?: string
  author?: string
  exclude?: { id: string }
}

interface PostOrPageOptions {
  id?: string
  slug?: string
}

interface TagOrAuthorOptions {
  slug?: string
}

interface AddMemberVariables {
  email: string
  name?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

interface UpdateMemberVariables {
  userId: string
  recipientId: string
}

export const getProjectOrCustomDomain = (apiUrl: string, hostOptions: HostOptions): GetProjectOrCustomDomainResult => {
  const result = { project: '', domain: '' }
  // process.env.BLOGODY_CUSTOM_HOST
  const { host } = hostOptions
  const blogodyCustomHost = hostOptions.custom || ''
  // custom domain: project must be determined on server
  if (host.search(blogodyCustomHost) > 0) {
    const domain = host.replace(`.${blogodyCustomHost}`, '')
    return { ...result, domain }
  }

  // project = subdomain
  const re = new RegExp(/^https:\/\/[^.]+(\..*)\/?/) //get domain ex subdomain
  const domain = apiUrl.match(re)?.[1] ?? ''
  const project = host.replace(domain, '')
  if (host.search(domain) > 0) {
    return { ...result, project }
  }

  // localhost
  if (project.search('.localhost') > 0) {
    return { ...result, project: project.replace('.localhost', '') }
  }

  // domain = project (coming from <Link>)
  return { ...result, domain: project }
}

const hostHeaders = (apiUrl: string, hostOptions?: HostOptions) => {
  if (!hostOptions) return undefined
  return {
    'x-blogody-domain': getProjectOrCustomDomain(apiUrl, hostOptions).domain,
    'x-blogody-project': getProjectOrCustomDomain(apiUrl, hostOptions).project,
  }
}

const fetchOptions = ({ key, apiUrl, hostOptions }: { key: string; apiUrl: string; hostOptions?: HostOptions }) => ({
  headers: {
    authorization: `Bearer ${key}`,
    ...hostHeaders(apiUrl, hostOptions),
  },
})

const initClient = ({
  key,
  apiUrl,
  hostOptions,
  apiPath = '/api/v1/graphql',
}: {
  key: string
  apiUrl: string
  hostOptions?: HostOptions
  apiPath?: string
}) =>
  createClient({
    url: `${apiUrl}${apiPath}`,
    fetchOptions: fetchOptions({ key, apiUrl, hostOptions }),
  })

const oneUser = (client: Client) => async (): Promise<User | null> => {
  try {
    const { data } = await client.query<{ oneUser: User }>(userQuery).toPromise()
    if (!data) return null
    const user = data.oneUser
    user.profileImage = user.profileImage || user.image
    return { ...user, image: '' }
  } catch {
    throw new Error('GraphQl fetching failed')
  }
}

const allSettings = (client: Client) => async (): Promise<Settings | null> => {
  let settings: Settings | null
  try {
    const { data } = await client.query<{ allSettings: Settings }>(allSettingsQuery).toPromise()
    settings = data?.allSettings ?? null
    //console.log('data_settings', data)
  } catch (error) {
    throw new Error('GraphQl fetching failed')
  }
  return settings
}

const allPosts =
  (client: Client) =>
  async (options?: PostsOrPagesOptions): Promise<Post[]> => {
    const { limit, tag, author, exclude } = { ...options }

    let posts: Post[]
    try {
      const { data } = await client.query<{ allPosts: Post[] }>(allPostsQuery).toPromise()
      posts = data?.allPosts || []
      //console.log('data_posts', data)
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }

    const allPosts = posts
      .filter(({ id }) => (exclude?.id ? id !== exclude.id : true))
      .filter(({ tagRelations }) => (tag ? tagRelations.map(({ tag }) => tag.slug).includes(tag) : true))
      .filter(({ authorRelations }) =>
        author ? authorRelations.map(({ author }) => author.slug).includes(author) : true
      )
      .filter((_, i) => (limit ? i + 1 < limit : true))
    return allPosts
  }

const allPages =
  (client: Client) =>
  async (options?: PostsOrPagesOptions): Promise<Page[]> => {
    const { limit, tag, author, exclude } = { ...options }

    let pages: Page[]
    try {
      const { data } = await client.query<{ allPages: Page[] }>(allPagesQuery).toPromise()
      pages = data?.allPages || []
      //console.log('data_pages', data)
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }

    const allPages = pages
      .filter(({ id }) => (exclude?.id ? id !== exclude.id : true))
      .filter(({ tagRelations }) => (tag ? tagRelations.map(({ tag }) => tag.slug).includes(tag) : true))
      .filter(({ authorRelations }) =>
        author ? authorRelations.map(({ author }) => author.slug).includes(author) : true
      )
      .filter((_, i) => (limit ? i + 1 < limit : true))
    return allPages
  }

const postBySlugOrId =
  (client: Client) =>
  async (options?: PostOrPageOptions): Promise<Post | null> => {
    const { id, slug } = { ...options }
    if (!id && !slug) return null

    const where_id = { ...(id && { id_userId: { id, userId: '' } }) }
    const where_slug = { ...(slug && { slug_projectId: { slug, projectId: '' } }) }
    const where = { ...where_id, ...where_slug }

    let post: Post | null
    try {
      const { data } = await client.query<{ post: Post; where: PostWhereUniqueInput }>(postQuery, { where }).toPromise()
      post = data?.post ?? null
      //console.log('data_post', data)
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }
    return post
  }

const pageBySlugOrId =
  (client: Client) =>
  async (options?: PostOrPageOptions): Promise<Page | null> => {
    const { id, slug } = { ...options }
    if (!id && !slug) return null

    const where_id = { ...(id && { id_userId: { id, userId: '' } }) }
    const where_slug = { ...(slug && { slug_projectId: { slug, projectId: '' } }) }
    const where = { ...where_id, ...where_slug }

    let page: Page | null
    try {
      const { data } = await client.query<{ page: Page; where: PageWhereUniqueInput }>(pageQuery, { where }).toPromise()
      page = data?.page ?? null
      //console.log('data_post', data)
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }
    return page
  }

const allTags =
  (client: Client) =>
  async (props?: { limit: number }): Promise<Tag[]> => {
    let tags: Tag[]
    try {
      const { data } = await client.query<{ allTags: { tags: Tag[] } }>(allTagsQuery).toPromise()
      tags = data?.allTags?.tags || []
      //console.log('data_tags', tags)
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }

    const allTags = tags.filter((_, i) => (props?.limit ? i + 1 < props.limit : true))
    return allTags
  }

const allAuthors =
  (client: Client) =>
  async (props?: { limit: number }): Promise<Author[]> => {
    let authors: Author[]
    try {
      const { data } = await client.query<{ allAuthors: { authors: Author[] } }>(allAuthorsQuery).toPromise()
      authors = data?.allAuthors?.authors || []
      //console.log('data_authors', authors)
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }

    const allAuthors = authors.filter((_, i) => (props?.limit ? i + 1 < props.limit : true))
    return allAuthors
  }

const upsertMember =
  (client: Client) =>
  async (variables: AddMemberVariables): Promise<Member | null> => {
    let member: Member | null
    try {
      const { data } = await client
        .mutation<{ confirmOneMember: Member }>(confirmOneMemberMutation, variables)
        .toPromise()
      member = data?.confirmOneMember || null
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }

    return member
  }

const unsubscribeOneMember =
  (client: Client) =>
  async (variables: UpdateMemberVariables): Promise<Member | null> => {
    let member: Member | null
    try {
      const { data } = await client
        .mutation<{ unsubscribeOneMember: Member }>(unsubscribeOneMemberMutation, variables)
        .toPromise()
      member = data?.unsubscribeOneMember || null
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }

    return member
  }

const emailOpenedOneMember =
  (client: Client) =>
  async (variables: UpdateMemberVariables): Promise<Member | null> => {
    let member: Member | null
    try {
      const { data } = await client
        .mutation<{ emailOpenedOneMember: Member }>(emailOpenedOneMemberMutation, variables)
        .toPromise()
      member = data?.emailOpenedOneMember || null
    } catch (error) {
      throw new Error('GraphQl fetching failed')
    }

    return member
  }

interface BlogodyAPIProps {
  key: string
  hostOptions?: HostOptions
  apiUrl?: string
  apiPath?: string
}

export class BlogodyAPI {
  private client: Client

  constructor({ key, hostOptions, apiUrl: url, apiPath }: BlogodyAPIProps) {
    const blogodyUrl = 'https://www.blogody.com'
    const apiUrl = url || blogodyUrl
    const client = initClient({ apiUrl, key, hostOptions, apiPath })
    this.client = client
  }

  async user(): Promise<User | null> {
    return await oneUser(this.client)()
  }

  async settings(): Promise<Settings | null> {
    return await allSettings(this.client)()
  }

  async tags(options?: { limit: number }): Promise<Tag[]> {
    return await allTags(this.client)(options)
  }

  async authors(options?: { limit: number }): Promise<Author[]> {
    return await allAuthors(this.client)(options)
  }

  async posts(options?: PostsOrPagesOptions): Promise<Post[]> {
    return await allPosts(this.client)(options)
  }

  async pages(options?: PostsOrPagesOptions): Promise<Page[]> {
    return await allPages(this.client)(options)
  }

  async post(options?: PostOrPageOptions): Promise<Post | null> {
    return await postBySlugOrId(this.client)(options)
  }

  async page(options?: PostOrPageOptions): Promise<Post | null> {
    return await pageBySlugOrId(this.client)(options)
  }

  async postOrPage(options?: PostOrPageOptions): Promise<PostOrPage | null> {
    // todo: make postOrPage graphql endpoint available
    const post = await postBySlugOrId(this.client)(options)
    if (post) return post
    return await pageBySlugOrId(this.client)(options)
  }

  async tag({ slug }: TagOrAuthorOptions): Promise<Tag | null> {
    // todo: make unique tag graphql endpoint available
    const tags = await this.tags()
    return tags?.find((tag) => tag.slug === slug) ?? null
  }

  async author({ slug }: TagOrAuthorOptions): Promise<Author | null> {
    // todo: make unique author graphql endpoint available
    const authors = await this.authors()
    return authors?.find((author) => author.slug === slug) ?? null
  }

  async confirmMember(variables: AddMemberVariables): Promise<Member | null> {
    return await upsertMember(this.client)(variables)
  }

  async unsubscribeMember(variables: UpdateMemberVariables): Promise<Member | null> {
    return await unsubscribeOneMember(this.client)(variables)
  }

  async memberEmailOpened(variables: UpdateMemberVariables): Promise<Member | null> {
    return await emailOpenedOneMember(this.client)(variables)
  }
}
