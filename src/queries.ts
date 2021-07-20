export const allSettingsQuery = `
  query {
    allSettings {
      title
      description
      lang
      navigations {
        sort
        label
        url
      }
      socials {
        sort
        label
        url
      }
    }
  }
`

export const allPostsQuery = `
  query {
    allPosts {
      id
      slug
      title
      featureImage
      html
      excerpt
      tagRelations {
        id
        sort
        tag {
          id
          name
          slug
        }
      }
      authorRelations {
        id
        sort
        author {
          id
          name
          slug
        }
      }
      publishedAt
    }
  }
`

export const allPagesQuery = `
  query {
    allPages {
      id
      slug
      title
      featureImage
      html
      excerpt
      tagRelations {
        id
        sort
        tag {
          id
          name
          slug
        }
      }
      authorRelations {
        id
        sort
        author {
          id
          name
          slug
        }
      }
      publishedAt
    }
  }
`

export const allTagsQuery = `
  query {
    allTags {
      tags {
        name
        slug
      }
    }
  }
`

export const allAuthorsQuery = `
  query {
    allAuthors {
      authors {
        name
        slug
      }
    }
  }
`

export const postQuery = `
  query post($where: PostWhereUniqueInput!) {
    post(where: $where) {
      id
      slug
      title
      featureImage
      html
      excerpt
      type
      tagRelations {
        id
        sort
        tag {
          id
          name
          slug
        }
      }
      authorRelations {
        id
        sort
        author {
          id
          name
          slug
        }
      }
      publishedAt
    }
  }
`

export const pageQuery = `
  query page($where: PageWhereUniqueInput!) {
    page(where: $where) {
      id
      slug
      title
      featureImage
      html
      excerpt
      type
      tagRelations {
        id
        sort
        tag {
          id
          name
          slug
        }
      }
      authorRelations {
        id
        sort
        author {
          id
          name
          slug
        }
      }
      publishedAt
    }
  }
`
