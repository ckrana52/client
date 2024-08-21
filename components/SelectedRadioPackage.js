/*
 *
 * Title: SelectedRadio
 * Description: --
 * Author: Masum
 * Date: 25 November 2021 (Thursday)
 *
 */


function SelectedRadioPackage({
  onChange,
  isChecked,
  isError,
  outOfStock,
  index,
  packageItem,
}) {
  return (
      <div
      onClick={onChange}
        className={`_select_box py-4 px-2 md:px-6 rounded-lg ${
          isChecked ? "border border-primary-500 bg-primary-300" : ""
        }
        ${outOfStock ? "pointer-events-none": ""}`}
      >
        {outOfStock && (
          <span className="absolute top-0 right-1.5 px-2 py-0 text-[11px] text-white bg-yellow-500 z-[5] rounded-full -translate-y-1/2">
            Out of stock
          </span>
        )}
        <div className="flex text-center flex-col mx-auto justify-center">
          <div className={`_body2 items-center ${outOfStock ? "opacity-40" : ""}`}>
            <span className="font-bold">{packageItem?.name}</span>
          </div>
          <div
            id="headlessui-description-8"
          >
            <span className={`!font-normal text-sm md:text-md text-red-500 ${outOfStock ? "opacity-40" : ""}`}>
              ৳ {packageItem?.price}
            </span>
          </div>
        </div>
      </div>
  );
}

export default SelectedRadioPackage;
