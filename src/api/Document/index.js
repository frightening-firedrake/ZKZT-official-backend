/** ------------------  Document --------------------- **/
import { get, post, put, _delete, get_query, get_path } from '@/utils/request'

const URL = '/document/'

export const GetDocument = p => get_query(URL, p)
export const CreateDocument = p => post(URL, p)
export const UpdateDocument1 = p => put(URL, p)

export const DeleteDocument = id => _delete(URL + id)

export const GetAllProductCategory = p => get(URL + 'productCategory', p)
export const GetAllThemeCategory = p => get(URL + 'themeCategory', p)

export const GetDocumentDetail = p => get_path(URL + 'detail/' + p)
export const GetDocumentById = p => get_path(URL + p)

import request from '@/utils/request'

export function UpdateDocument(data) {
  return request({
    url: URL,
    method: 'put',
    data,
    transformRequest: [data => {
      let ret = ''
      for (const i in data) {
        ret += encodeURIComponent(i) + '=' + encodeURIComponent(data[i]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
