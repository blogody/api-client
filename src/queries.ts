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
  mutation confirmOneMember($email: String!, $name: String, $image: String, $createdAt: DateTime, $updatedAt: DateTime) {
    confirmOneMember(email: $email, name: $name, image: $image, createdAt: $createdAt, updatedAt: $updatedAt) {
      id
    }
  }
`

export const unsubscribeOneMemberMutation = `
  mutation unscubscribeOneMember($userId: String!, $recipientId: String!) {
    unsubscribeOneMember(userId: $userId, recipientId: $recipientId) {
      id
    }
  }
`

export const emailOpenedOneMemberMutation = `
  mutation emailOpenedOneMember($userId: String!, $recipientId: String!) {
    emailOpenedOneMember(userId: $userId, recipientId: $recipientId) {
      id
    }
  }
`
