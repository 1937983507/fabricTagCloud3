<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 获取表单提交的数据
    $email = $_POST['email_input'];
    $issueType = $_POST['issue_type'];
    $issueTitle = $_POST['issue_title'];
    $issueDescription = $_POST['issue_description'];
    $errorMessage = $_POST['error_message'];

    // 上传文件处理
    $fileUploaded = false;
    if(isset($_FILES['file_upload']) && $_FILES['file_upload']['error'] === UPLOAD_ERR_OK) {
        $fileUploaded = true;
        $fileName = $_FILES['file_upload']['name'];
        $fileTmpName = $_FILES['file_upload']['tmp_name'];
        $fileSize = $_FILES['file_upload']['size'];
        $fileType = $_FILES['file_upload']['type'];
        // 文件上传目标路径（假设在服务器的 uploads 目录下）
        $uploadDir = __DIR__ . '/uploads/';
        // 检查目录是否存在，若不存在则创建
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        $filePath = $uploadDir . $fileName;
        // 将文件从临时位置移动到目标位置
        move_uploaded_file($fileTmpName, $filePath);
    }
    
    // 获取当前时间
    $currentDateTime = date("Y-m-d H:i:s");
    
    
    // 连接数据库
    $servername = "localhost"; // MySQL 服务器地址
    $username = "root"; // MySQL 用户名
    $password = "123456"; // MySQL 密码
    $dbname = "tagcloud"; // 数据库名

    // 创建数据库连接
    $conn = new mysqli($servername, $username, $password, $dbname);

    // 检查连接是否成功
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // 插入数据到数据库
    $sql = "INSERT INTO feedback (time, email, issueType, issueTitle, description, errorMessage, filePath)
    VALUES ('$currentDateTime', '$email', '$issueType', '$issueTitle', '$issueDescription', '$errorMessage', '$fileName')";

    if ($conn->query($sql) === TRUE) {
        echo "数据提交成功";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    
    // // 通过QQ邮箱发送邮件需要配置SMTP服务器信息
    // $smtp_server = 'smtp.qq.com'; // QQ 邮箱 SMTP 服务器地址
    // $smtp_username = '1937983507@qq.com'; // 您的QQ邮箱地址
    // $smtp_password = 'kzl690325'; // 您的QQ邮箱密码
    // $smtp_port = 465; // QQ 邮箱 SMTP 服务器端口号（SSL加密）
    
    // // 发件人的姓名和邮件地址
    // $from_name = "柯张镭";
    // $from_email = "1937983507@qq.com";
    
    // // 开发者的邮箱地址，将此地址替换为实际的开发者邮箱地址
    // $to_email = "1937983507@qq.com"; 
    // // 邮件主题
    // $subject = "用户反馈"; 
    // // 邮件内容，包含表单数据
    // $message = "邮箱地址：$email\n工单类型：$issueType\n工单标题：$issueTitle\n工单描述：$issueDescription\n报错信息：$errorMessage"; 
    
    // // 邮件头部
    // $headers = "From: $from_name <$from_email>" . "\r\n";
    // $headers .= "Reply-To: $from_email" . "\r\n";
    // $headers .= "MIME-Version: 1.0" . "\r\n";
    // $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    
    // // 发送邮件
    // if (mail($to_email, $subject, $message, $headers)) { // 使用 mail() 函数发送邮件
    //     echo "数据提交成功，并已发送邮件至开发者邮箱"; // 如果邮件发送成功，则输出成功消息
    // } else {
    //     echo "邮件发送失败"; // 如果邮件发送失败，则输出失败消息
    // }



    // 关闭数据库连接
    $conn->close();
    
    

    
    
    // // 打印或处理接收到的数据
    // echo "数据提交成功<br>";
    // echo "邮箱地址: " . $email . "<br>";
    // echo "工单类型: " . $issueType . "<br>";
    // echo "工单标题: " . $issueTitle . "<br>";
    // echo "工单描述: " . $issueDescription . "<br>";
    // echo "报错信息: " . $errorMessage . "<br>";
    // if ($fileUploaded) {
    //     echo "上传的文件: " . $fileName . "<br>";
    //     echo "文件类型: " . $fileType . "<br>";
    //     echo "文件大小: " . $fileSize . " bytes<br>";
    //     echo "文件存储路径: " . $filePath . "<br>";
    // }
    
    // echo "<script>setTimeout(function() { window.location.href = 'index.html'; }, 5000);</script>";
    echo "<script> window.location.href = 'timeout.html'; </script>";
    
    
    
} else {
    // 如果不是 POST 请求，重定向到反馈表单页面
    header("Location: feedback.html");
    exit;
}
?>
