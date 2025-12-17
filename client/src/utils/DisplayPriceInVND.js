// export const DisplayPriceInVND = (price)=>{
//     return new Intl.NumberFormat('en-IN',{
//         style : 'currency',
//         currency : 'INR'
//     }).format(price)
// }
export const DisplayPriceInVND = (price) => {
    // Validate and convert to number
    const numPrice = Number(price);
    
    // Return 0 đ if price is invalid or NaN
    if (isNaN(numPrice) || !isFinite(numPrice)) {
        return '0 ₫';
    }
    
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(numPrice);
}
