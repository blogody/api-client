export const userQuery = `
  query {
    oneUser {
      email
    }
  }
`

export const allSettingsQuery = `
  query {
    allSettings {
      title
      description
      descriptionHidden
      lang
      accent
      brandLabel
      brandUrl
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
      analytics {
        provider
        trackingId
      }
      updatedAt
      url
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
      featureImageWidth
      featureImageHeight
      featureImageBlur
      html
      excerpt
      canonicalUrl
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
      updatedAt
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
      featureImageWidth
      featureImageHeight
      featureImageBlur
      html
      excerpt
      canonicalUrl
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
      updatedAt
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
      featureImageWidth
      featureImageHeight
      featureImageBlur
      html
      excerpt
      canonicalUrl
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
      updatedAt
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
      featureImageWidth
      featureImageHeight
      featureImageBlur
      html
      excerpt
      canonicalUrl
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
      updatedAt
    }
  }
`

export const confirmOneMemberMutation = `
  mutation confirmOneMember($email: String!, $image: String) {
    confirmOneMember(email: $email, image: $image) {
      id
    }
  }
`

export const unsubscribeOneMemberMutation = `
  mutation unscubscribeOneMember($recipientId: String!, $email: String!) {
    unsubscribeOneMember(recipientId: $recipientId, email: $email) {
      id
    }
  }
`
