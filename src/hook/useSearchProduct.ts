import axios from 'axios'
import { useEffect, useState } from 'react'

interface Product {
    id: string;
    title: string;
    price: number;
    images: string[];
}

export default function useSearchProduct(query: string, pageNumber: number) {

    const [loading, setLoading] = useState(true)
    const [hasMore, setHasMore] = useState(false)
    const [error, setError] = useState(false)
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        setProducts([])
    }, [query])

    useEffect(() => {
        setLoading(true)
        setError(false)
        let cancel: any;
        axios({
            method: 'get',
            url: 'https://dummyjson.com/products/search',
            params: {
                q: query,
                skip: pageNumber,
                limit: '20',
                select: 'title,price,images'
            },
            cancelToken: new axios.CancelToken((c) => cancel = c)
        }).then(res => {
            const newProducts: Product[] = res.data.products;
            setProducts((prevProducts: Product[]) => [...prevProducts, ...newProducts]);
            setHasMore(res.data.products.length > 0)
            setLoading(false)
        }).catch(e => {
            if (axios.isCancel(e)) return
            setError(true)
        })

        return () => cancel()
    }, [query, pageNumber])

    return { loading, error, products, hasMore }
}
