/*
 *
 * Title: Game
 * Description: --
 * Author: Saymon
 * Date: 25 November 2021 (Thursday)
 *
 */
import Link from 'next/link';
import { imgPath } from '/helpers/helpers';
function Game({ game }) {
  const { logo, name, id } = game;
  return (
    <div className="_product_wrapper">
      <Link href={`/topup/${id}`}>
        <a>
          <img
            src={imgPath(logo)}
            className="bg-gray-100 w-full h-auto object-cover"
            alt={name}
          />
          <div className="py-2 px-1">
            <h6 className="_h6 text-center !text-sm">{name}</h6>
          </div>
        </a>
      </Link>
    </div>
  );
}

export default Game;
