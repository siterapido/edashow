import { getPost, getCategories, getAuthors } from '@/lib/actions/cms-posts'
import { PostEditor } from '@/components/cms/PostEditor'
import { notFound } from 'next/navigation'

export default async function CMSPostEditPage({ params }: { params: { id: string } }) {
    const { id } = await params

    let post = null
    if (id !== 'new') {
        try {
            post = await getPost(id)
        } catch (e) {
            notFound()
        }
    }

    const [categories, authors] = await Promise.all([
        getCategories(),
        getAuthors()
    ])

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PostEditor
                post={post}
                categories={categories}
                authors={authors}
            />
        </div>
    )
}

