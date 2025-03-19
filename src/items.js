const items = Array.from({length:100}).map((_,i)=>({
    id:i,
    name:`Item ${i}`
}));

const limit=10;

export const fetchItems = async ({pageParam}) => {
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve({
                data: items.slice(pageParam, pageParam + limit),
                currentPage: pageParam,
                nextPage: pageParam + limit < items.length ? pageParam + limit : null,
            })
        },1000)
    });
}