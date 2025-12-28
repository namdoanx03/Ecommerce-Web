const forgotPasswordTemplate = ({ name, otp })=>{
    return 
    `
    <div>
        <p>Dear, ${name}</p>
        <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng sử dụng mã OTP dưới đây để đặt lại mật khẩu của bạn.</p>
        <div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
            ${otp}
        </div>
        <p>Mã OTP này chỉ có hiệu lực trong vòng 1 giờ. Vui lòng nhập mã OTP này trên website Binkeyit để tiếp tục quá trình đặt lại mật khẩu.</p>
        <br/>
        </br>
        <p>Xin cảm ơn</p>
        <p>Binkeyit</p>
    </div>
    `
}

export default forgotPasswordTemplate