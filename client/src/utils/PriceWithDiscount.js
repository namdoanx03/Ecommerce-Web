export const pricewithDiscount = (price, dis = 1) => {
    // Validate input
    const numPrice = Number(price);
    const numDis = Number(dis);
    
    // Return 0 if price is invalid
    if (isNaN(numPrice) || numPrice <= 0) {
        return 0;
    }
    
    // If discount is invalid or 0, return original price
    if (isNaN(numDis) || numDis <= 0) {
        return numPrice;
    }
    
    const discountAmount = Math.ceil((numPrice * numDis) / 100);
    const actualPrice = numPrice - discountAmount;
    
    // Ensure result is not negative
    return actualPrice > 0 ? actualPrice : 0;
}