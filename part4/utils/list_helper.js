const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return null
    }
    const reducer = (favorite, blog) => {
        return (favorite.likes > blog.likes)
            ? favorite
            : blog
    }
    return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const reducer = (acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }

    const counts = blogs.reduce(reducer, {})

    const maxAuthor = Object.keys(counts).reduce((a, b) =>
        counts[a] > counts[b] ? a : b
    )
    return {
        author: maxAuthor,
        blogs: counts[maxAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const reducer = (acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }

    const likesByAuthor = blogs.reduce(reducer, {})

    const mostLikesAuthor = Object.keys(likesByAuthor).reduce((a, b) =>
        likesByAuthor[a] > likesByAuthor[b] ? a : b
    )
    return {
        author: mostLikesAuthor,
        likes: likesByAuthor[mostLikesAuthor]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
