import { ChangeEvent, FormEvent, InvalidEvent, useState,  } from 'react'
import { Avatar } from './Avatar'
import { Comment } from './Comment'
import styles from './Post.module.css'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale/pt-BR'

interface Author {
    name: string
    role: string
    avatar_url: string
}

interface Content {
    type: 'paragraph' | 'link'
    content: string
}

export interface PostType {
    id: number
    author: Author
    publishedAt: Date
    content: Content[]
}

interface PostProps {
    post: PostType
}

export function Post({ post }: PostProps) {

    const [comments, setComments] = useState([
        'Post muito bacana, hein?!'
    ])

    const [newComment, setNewComment] = useState('')

    const publishedDateFormatted = format(post.publishedAt, "d 'de' LLLL 'às' HH:mm'h'", {
        locale: ptBR,
    })

    const publishedDateRelativeToNow = formatDistanceToNow(post.publishedAt, {
        locale: ptBR,
        addSuffix: true
    })

    function handleCreateNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity("");
        setNewComment(event.target.value)
    }

    function handleCreateNewComment(event: FormEvent) { 
        event.preventDefault()

        setComments([...comments, newComment]);

        setNewComment('')
    }

    function deleteComment(commentToDelete: string) {
        const commentsWithoutDeletedOne = comments.filter((comment) => comment !== commentToDelete)
        setComments(commentsWithoutDeletedOne)
    }

    function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
        event.target.setCustomValidity("Esse campo é obrigatório!");
    }
    
    const isNewCommentEmpty = newComment.length === 0

    return (
        <article className={styles.post}>
            <header>
                <div className={styles.author}>
                    <Avatar src={post.author.avatar_url} />
                    <div className={styles.authorInfo}>
                        <strong>{post.author.name}</strong>
                        <span>{post.author.role}</span>
                    </div>
                </div>

                <time title={publishedDateFormatted} dateTime={post.publishedAt.toISOString()}>
                    {publishedDateRelativeToNow}
                </time>
            </header>

            <div className={styles.content}>
                {post.content.map((line) => {
                    if (line.type === "paragraph") {
                        return <p key={line.content}>{line.content}</p>
                    } else if (line.type === "link") {
                        return <p key={line.content}><a href="#">{line.content}</a></p>
                    }
                })}
            </div>

            <form className={styles.commentForm} onSubmit={handleCreateNewComment}>
                <strong>Deixe seu feedback</strong>

                <textarea
                    placeholder='Deixe um comentário'
                    name='comment'
                    value={newComment}
                    onChange={handleCreateNewCommentChange}
                    onInvalid={handleNewCommentInvalid}
                    required
                />
                <footer>
                    <button type='submit' disabled={isNewCommentEmpty}>Publicar</button>
                </footer>
            </form>

            <div className={styles.commentList}>
                {comments.map((comment) => {
                    return <Comment
                        key={comment}
                        content={comment}
                        onDeleteComment={deleteComment} />
             })}
            </div>
        </article>
    )
}