/** ------------------  Document --------------------- **/
// import { get, post_query, put_query, _delete, get_query, get_path } from '@/utils/request'
import { get, post, put, _delete, get_query, get_path } from '@/utils/request'

const URL = '/document/'

export const GetDocument = p => get_query(URL, p)
// export const CreateDocument = p => post_query(URL, p)
export const CreateDocument = p => post(URL, p)
// export const UpdateDocument = p => put_query(URL, p)
export const UpdateDocument = p => put(URL, p)

export const DeleteDocument = id => _delete(URL + id)

export const GetAllProductCategory = p => get(URL + 'productCategory', p)
export const GetAllThemeCategory = p => get(URL + 'themeCategory', p)

export const GetDocumentDetail = p => get_path(URL + 'detail/' + p)
export const GetDocumentById = p => get_path(URL + p)
