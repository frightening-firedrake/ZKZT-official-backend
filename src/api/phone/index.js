/** ------------------  Phone --------------------- **/
// import { get, post_query, put_query, _delete, get_path } from '@/utils/request'
import { get, post, put, _delete, get_path } from '@/utils/request'

const URL = '/common/phone/'

export const GetPhone = p => get(URL, p)
// export const CreatePhone = p => post_query(URL, p)
// export const UpdatePhone = p => put_query(URL, p)
export const CreatePhone = p => post(URL, p)
export const UpdatePhone = p => put(URL, p)

export const DeletePhone = id => _delete(URL + id)

export const GetPhoneDetail = p => get_path(URL + 'detail/' + p)
export const GetPhoneById = p => get_path(URL + p)
