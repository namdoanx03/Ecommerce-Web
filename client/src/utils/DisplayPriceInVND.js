// export const DisplayPriceInVND = (price)=>{
//     return new Intl.NumberFormat('en-IN',{
//         style : 'currency',
//         currency : 'INR'
//     }).format(price)
// }
export const DisplayPriceInVND = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}
