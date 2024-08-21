/*
 *
 * Title: NoticePopup
 * Description: --
 * Author: Saymon
 * Date: 25 November 2021 (Thursday)
 *
 */
import { useEffect, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { getFlatNotice } from '../../api/api';
import { __last_seen_modal_key } from '../../config/globalConfig';
import reactQueryConfig from '../../config/reactQueryConfig';
import { hasData, imgPath } from '../../helpers/helpers';
import { getSession, setSession } from '../../lib/localStorage';
function FlatNotice() {
  const [showModal, setShowModal] = useState(false);
  const { data } = useQuery('flat-notice', getFlatNotice, reactQueryConfig);

  useEffect(() => {
    const isAlreadySeenModal = getSession(__last_seen_modal_key) === data?.id;
    if (hasData(data) && !isAlreadySeenModal) {
      setShowModal(true);
    }
  }, [data]);

  const closeModal = (id) => {
    setSession(__last_seen_modal_key, id);
    setShowModal(false);
  };

  if (!showModal) return null;
  return (
    <div className="container sm:mb-1 md:mb-0 mb-2 ">
      <div className="bg-primary-400 bg-opacity-40 md:p-3 p-1">
        <div className="flex _animate_slide_in">
          <div className="rounded-md overflow-hidden mr-auto">
            <div className="p-1">
              {/* {data?.title && <h3 className="_h3 mb-1.5">{data?.title}</h3>} */}
              <b>Notice: </b>
              {data?.notice && <p className="_subtitle1">{data?.notice}</p>}
            </div>
          </div>
          {/* Close Popup --Start-- */}
          <div
            onClick={() => closeModal(data?.id)}
            className="w-5 h-5 rounded-full"
          >
            <IoCloseSharp className="w-full h-full" />
          </div>
          {/* Close Popup --End-- */}
        </div>
      </div>
    </div>
  );
}

export default FlatNotice;
