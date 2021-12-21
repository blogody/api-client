# Blogody API Client for your JavaScript/TypeScript projects

An isomorphic JavaScript/TypeScript client for Blogody. This package makes pulling data from headless [Blogody CMS](https://www.blogody.com) a breeze.

## 🚀 Quick start

1.  **Install the client**

    ```shell
    yarn add @blogody/api-client
    ```

2.  **Use the client in your js/ts projects**

    ```javascript
    import { BlogodyAPI } from '@blogody/api-client'

    const api = new BlogodyAPI({ key: 'YOUR BLOGODY API ACCESS KEY' })

    // make an API calls
    const settings = await api.settings()
    const posts = await api.posts()

    console.log(posts)
    ```

## 🔑 Blogody API Keys

Go to your Blogody account and create a new key under Settings > Developers.

# Copyright & License

Copyright (c) 2021 Blogody - Released under the [MIT license](LICENSE).

Library makers:

https://github.com/bitjson/typescript-starter
https://github.com/alexjoverm/typescript-library-starter

