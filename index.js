import querystring from 'querystring'
import { makeRequest } from './helpers'

class Client {
    constructor(apiKey, options) {
        this.apiKey = apiKey;
        this.options = options;
    }
    
    /**
     * Makes a request to the API
     */
    async request(url, options = {}) {
        return await makeRequest(url, {
            ...options,
            headers: {
                'x-api-key': this.apiKey,
                ...options.headers
            }
        });
    }
    
    /**
    * Returns paginated list of posts for the account
    * @param {Number} limit number of posts returned
    * @param {Number} page page number
    * @return {Object} { posts: [ ... ] }
    */
    async listPosts(limit, page) {
        return await this.request(
            `/blog?action=list-posts&${querystring.stringify({ limit, page })}`
        );
    }

    /**
    * Returns list of files for the account
    * @param {String} folder folder with files, can be 'images', 'users' or 'icons'
    * @param {Number} limit number of files returned
    * @param {String} nextFile use nextFile from previous call to get next page
    * @return {Object} { files: [ ... ], nextFile: '...' }
    */
    async listFiles(folder, limit, nextFile) {
        return await this.request(
            `/blog?action=list-files&${querystring.stringify({ folder, limit, nextFile })}`
        );
    }

    /**
    * Uploads a WebP or JPEG file. Doesn't support multipart.
    * @param {String} folder folder with files, can be 'images', 'users' or 'icons'
    * @param {String} stream pass stream as in fs.createReadStream('foo.webp') to upload a file.
    * @param {Number} fileLength pass file total size in bytes
    * @return {Object} { success: true, fileName: '...' }
    */
    async uploadFile(fileName, stream, fileLength) {
        return await this.request(
            `/blog?action=upload-file&${querystring.stringify({ fileName })}`,
            {
                method: 'POST',
                body: stream,
                headers: {
                    'Content-Length': fileLength
                }
            }
        );
    }

    /**
    * Returns post by id
    * @param {String} id post ID
    * @return {Object} { id: '...', slug: '...', title: '...', ... }
    */
    async getPostByID(id) {
        return await this.request(
            `/blog?action=get-post&${querystring.stringify({ id })}`
        );
    }

    /**
    * Returns post by slug
    * @param {String} slug post slug
    * @return {Object} { id: '...', slug: '...', title: '...', ... }
    */
    async getPostBySlug(slug) {
        return await this.request(
            `/blog?action=get-post&${querystring.stringify({ slug })}`
        );
    }

    /**
    * Creates a new post. See more details on data https://bytebard.co/help/api
    * @param {Object} data post fields, including slug, title, content, description, keywords, image, image_credit, author_name, author_picture
    * @return {Object} { id: '...', slug: '...', title: '...', ... }
    */
    async createPost(data = {}, disableAutopost) {
        if (disableAutopost) data.autopost = false;
        return await this.request(
            `/blog?action=create-post`,
            {
                method: 'POST',
                body: JSON.stringify(data)
            }
        );
    }

    /**
    * Updates an existing post. See more details on data https://bytebard.co/help/api
    * @param {String} id post ID
    * @param {Object} data post fields, including slug, title, content, description, keywords, image, image_credit, author_name, author_picture
    * @return {Object} { success: true }
    */
    async updatePost(id, data = {}) {
        return await this.request(
            `/blog?action=update-post`,
            {
                method: 'POST',
                body: JSON.stringify({ id, ...data })
            }
        );
    }

    /**
     * Imports posts from a JSON. Limited to 100 posts per call.
     * @param {Array} posts list of posts to import
     * @return {Object} { success: true, error:'no errors', inserted: 5 }
     */
    async importPosts(posts) {
        return await this.request(
            `/blog?action=import-posts`,
            {
                method: 'POST',
                body: JSON.stringify({ posts })
            }
        );
    }

    /**
     * Removes a post
     * @param {String} id post ID
     * @return {Object} { success: true }
     */
    async removePost(id) {
        return await this.request(
            `/blog?action=remove-post&${querystring.stringify({ id })}`,
            {
                method: 'DELETE'
            }
        );
    }

    /**
     * Removes a file
     * @param {String} folder folder name
     * @param {String} name file name
     * @return {Object} { success: true }
     */
    async removeFile(folder, name) {
        return await this.request(
            `/blog?action=remove-file&${querystring.stringify({ folder, name })}`,
            {
                method: 'DELETE'
            }
        );
    }

    /**
     * Reindexes a site
     * @param {Array} urls (optional) URLs to reindex, if not specified, all site URLs will be reindexed
     * @return {Object} { success: true }
     */
    async reindex(urls) {
        return await this.request(
            `/blog?action=reindex`,
            {
                method: 'POST',
                body: urls ? JSON.stringify({ urls }) : undefined
            }
        );
    }
}

export default Client;
