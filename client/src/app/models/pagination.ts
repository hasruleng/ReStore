export interface MetaData {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
}

export class PaginatedResponse<T> { //bedanya class dengan interface, kalau di class properti harus dikasih value
    items: T;  //T is gonna be product's array
    metaData: MetaData;
    
    constructor(items: T, metaData: MetaData){
        this.items=items;
        this.metaData=metaData;
    }
}