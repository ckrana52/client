/*
 *
 * Title: DataTable
 * Description: --
 * Author: Saymon
 * Date: 25 November 2021 (Thursday)
 *
 */
import { useInfiniteQuery } from 'react-query';
import reactQueryConfig from '../../config/reactQueryConfig';
import { hasData } from '../../helpers/helpers';
import ActivityIndicator from '../ActivityIndicator';
import Button from '../Button';

function DataTable({ children, apiKey, apiFunc, title, columns }) {
  if (!apiKey) throw new Error('apiKey is required');
  // const { data, isLoading, isError, error } = useQuery(
  //   apiKey,
  //   apiFunc,
  //   reactQueryConfig
  // );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
  } = useInfiniteQuery(apiKey, apiFunc, {
    ...reactQueryConfig,
    select: (res) => {
      let ff = [];
      res.pages.forEach((page) => {
        ff = [...ff, ...page.data.data.data];
      });

      return ff;
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.data?.nextPage || undefined;
    },
  });

  return (
    <div className="container md:border border-gray-200 md:rounded-md pt-7 relative">
      {title && (
        <p className="_subtitle2 font-semibold text-white bg-primary-500 absolute top-0 -translate-y-1/2 py-1 px-4 rounded-full border border-primary-500 tracking-wide">
          {title}
        </p>
      )}

      <div className="overflow-auto">
        {hasData(data) && (
          <table className="border-collapse w-full">
            <thead>
              <tr className="bg-gray-50">
                {columns?.map((column, index) => (
                  <th
                    key={index}
                    className="py-2.5 px-3 whitespace-nowrap _subtitle2 font-semibold text-center text-gray-800"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children(data)}</tbody>
          </table>
        )}
        {hasData(data) && hasNextPage && (
          <div className="flex justify-center mt-5 mb-4">
            <Button
              text="Load More"
              loading={isFetching || isFetchingNextPage}
              disabled={!hasNextPage}
              onClick={fetchNextPage}
            />
          </div>
        )}
        <ActivityIndicator
          data={data}
          loading={isLoading}
          error={isError ? error : false}
        />
      </div>
    </div>
  );
}

export default DataTable;
