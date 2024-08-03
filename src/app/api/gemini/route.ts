import { fetchStockNews } from "../../../../utils"

export async function POST(req: Request, res: Response) {
    const { query } = await req.json()
    const news =  await fetchStockNews(query)
    return Response.json({ news })
}