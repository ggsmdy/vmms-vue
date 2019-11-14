import axios from '@/libs/api.request'

export const getTableData = (curPage, pageSize) => {
  return axios.request({
    url: '/v1/get_table_data',
    method: 'get',
    params: {
      curPage: curPage,
      pageSize: pageSize
    }
  })
}
