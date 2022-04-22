/** ------------------  Product --------------------- **/
import { get, post_query, put_query, _delete, get_path } from '@/utils/request'

const URL = '/product/'

export const GetProduct = p => get(URL, p)
export const CreateProduct = p => post_query(URL, p)
export const UpdateProduct = p => put_query(URL, p)

export const DeleteProduct = id => _delete(URL + id)

export const GetProductDetail = p => get_path(URL + 'detail/' + p)
export const GetProductById = p => get_path(URL + p)
