import { Client, createClient } from 'urql'
import { Post, Page, PostOrPage, Tag, Author, Settings, PageWhereUniqueInput, PostWhereUniqueInput } from './types'
import {
  allSettingsQuery,
  allPostsQuery,
  allPagesQuery,
  allTagsQuery,
  allAuthorsQuery,
  postQuery,
  pageQuery,
} from './queries'

const blogodyUrl = 'https://www.blogody.io'

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

export const getProjectOrCustomDomain = (hostOptions: HostOptions): GetProjectOrCustomDomainResult => {
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
  const domain = blogodyUrl.replace('https://www', '')
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

const hostHeaders = (hostOptions?: HostOptions) => {
  if (!hostOptions) return undefined
  return {
    'x-blogody-domain': getProjectOrCustomDomain(hostOptions).domain,
    'x-blogody-project': getProjectOrCustomDomain(hostOptions).project,
  }
}

const fetchOptions = ({ key, hostOptions }: { key: string; hostOptions?: HostOptions }) => ({
  headers: {
    authorization: `Bearer ${key}`,
    ...hostHeaders(hostOptions),
  },
})

const initClient = ({ url, key, hostOptions }: { url: string; key: string; hostOptions?: HostOptions }) =>
  createClient({
    url: `${url}/api/v1/graphql`,
    fetchOptions: fetchOptions({ key, hostOptions }),
  })

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

interface BlogodyAPIProps {
  key: string
  hostOptions?: HostOptions
}

export class BlogodyAPI {
  private client: Client

  constructor({ key, hostOptions }: BlogodyAPIProps) {
    const client = initClient({ url: blogodyUrl, key, hostOptions })
    this.client = client
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
}
