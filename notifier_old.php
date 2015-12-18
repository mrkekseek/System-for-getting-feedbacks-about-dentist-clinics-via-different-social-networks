<?php
//URL's

$dentisturl = 'https://www.zorgkaartnederland.nl/tandartsenpraktijk';

//Config for rating retrieval
libxml_use_internal_errors(true);
$htmldoc = new DomDocument();
$htmldoc->loadHTML(file_get_contents($dentisturl));
$xpath = new DomXpath($htmldoc);
//Db Config
$servername = "181.224.143.216";
$username = "opvolger_cr";
$password = "1001reviews$#WK";
$dbName = "opvolger_patientenreview_app";

// Create db connection
$conn = new mysqli($servername, $username, $password, $dbName);

// Check db connection
if ($conn->connect_error) {
	die("Connection failed: " . $conn->connect_error);
} 


//Retrieve rating page
$CompanyName = $xpath->query('(//*[@class="collapsable_list simple_list"])[2]/li/a')->item(0)->nodeValue;
$CompanyRating = $xpath->query('(//*[@class="collapsable_list simple_list"])[2]/li/span')->item(0)->nodeValue;
$RatingURL = "http://zorgkaartnederland.nl".$xpath->query('(//*[@class="collapsable_list simple_list"])[2]/li/a/@href')->item(0)->nodeValue;
$CompanyURL = preg_replace("/waardering.*/", "", $RatingURL);

//Retrieve company page to get email
$companyhtmldoc = new DomDocument();
$companyhtmldoc->loadHTML(file_get_contents($CompanyURL));
$companyxpath = new DomXpath($companyhtmldoc);

$CompanyWebsite = $companyxpath->query('(//*[@class="address_row"])[4]/a')->item(0)->nodeValue;
$CompanyEmail = str_replace("www.", "info@", "$CompanyWebsite");
$VerifyURL = "www.emailhunter.co/verify?email=".$CompanyEmail;

$CompanyPhone = $companyxpath->query('(//*[@class="address_row"])[3]/span')->item(0)->nodeValue;

//Email config

require 'mailer/PHPMailerAutoload.php';
$mail = new PHPMailer;
$mail->CharSet = 'UTF-8';
//$mail->SMTPDebug = 2;                               // Enable verbose debug output
/*
$mail->isSMTP();                                      // Set mailer to use SMTP
$mail->Host = 'mail.patientenreview.nl';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'info@patientenreview.nl';                 // SMTP username
$mail->Password = '1001reviews$#WK';                       // SMTP password
//$mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 2525;                                    // TCP port to connect to
*/
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = 'nickvandenberg31@gmail.com';                 // SMTP username
$mail->Password = 'ferraridag';                       // SMTP password
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port = 465;    

$mail->setFrom('support@patientenreview.nl', 'Patiëntenreview Notificaties');
$mail->addAddress('development@cloudrocket.co', 'Cloudrocket');     // Add a recipient
$mail->addAddress('info@patientenreview.nl', 'Patiëntenreview');     // Add a recipient
$mail->isHTML(true);                                  // Set email format to HTML
$mail->Subject = 'Negatieve beoordeling gedecteerd';
$mail->Body    = '<!DOCTYPE html>
<html>
<head>
</head>

<body style="padding: 0; margin: 0;">
<div style="margin: 0 auto; min-width: 400px; background: #EAEAEA;">
<div style="padding: 15px 15px 0;">
<div style="height: 30px; background: #fff; padding: 10px; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);">
<a href="javascript:void(0);">
<img src="http://app.patientenreview.nl/application/views/images/logo_full.png" height="30" alt="" />
</a>
</div>
</div>

<div style="padding: 15px 15px 0;">
<div style="background: #fff; border-radius: 10px 10px 0 0; border: solid #E3E3E3 1px;">
<p style="margin: 0; font: bold 14px/40px arial, sans-serif; color: #525354; padding: 0 10px; background: #F6F6F6; border-radius: 10px 10px 0 0;">
Negatieve beoordeling over '.$CompanyName.'
</p>

<div style="padding: 20px;">				
<p style="margin: 0; font: 13px/1.3 arial, sans-serif; color: #525354; padding-bottom: 15px;">
Er is een negatieve beoordeling gedecteerd over het bedrijf met de volgende gegevens:
<table style="color: #525354;">
<tr>
<td>Bedrijfsnaam:</td>
<td>'.$CompanyName.'</td>
</tr>
<tr>
<td>Beoordeling:</td>
<td style="color:red;">'.$CompanyRating.'</td>
</tr>
<tr>
<td>Telefoonnummer:</td>
<td>'.$CompanyPhone.'</td>
</tr>
<tr>
<td>Vermoedelijk e-mailadres:</td>
<td style="color:red;">'.$CompanyEmail.'</td>

</tr>
<tr>
<td></td>
<td style="color:red;"><a href="'.$VerifyURL.'" target="_blank">Verifieer e-mailadres</td>
</tr>
</table>
</p>

<p style="margin: 0; font: 13px/1.3 arial, sans-serif; color: #525354; padding-bottom: 15px;">
<a href="'.$RatingURL.'" style="display: block; margin-top: 10px; width: 200px; text-decoration: none; text-align: center; border-radius: 2px; font-size: 14px; line-height: 1.5; padding: 6px 12px; background-color:#0f75bc; color: #fff;" target="_blank">Bekijk beoordeling</a>
</p>

</div>
</div>

<p style="margin: 0; padding: 15px 0 10px; font: 11px/1.3 arial, sans-serif; color: #525354; text-align: center;">
&copy; '.date("Y").' Patiëntenreview. Alle rechten voorbehouden.
</p>
</div>
</div>
</body>
</html>';

//Check if element is the same as the last one added

$selectquery = "SELECT rating_url, given_rating FROM notifier_last_rated ORDER BY created_at DESC LIMIT 1";
$result = $conn->query($selectquery);

$LastURL = $result->fetch_assoc()['rating_url'];
$LastRating = $result->fetch_assoc()['given_rating'];

$timestamp = date('Y-m-d G:i:s');

if ($RatingURL != $LastURL && $CompanyRating != $LastRating) {
	//If not, perform actions
	//First, add record to db

	$insertquery = "INSERT INTO notifier_last_rated (rating_url, given_rating, created_at) VALUES ('".$RatingURL."', '".$CompanyRating."', '".$timestamp."')";

	if ($conn->query($insertquery) === TRUE) {
		$last_id = $conn->insert_id;
		echo "New record created successfully. Last inserted ID is: " . $last_id;
	} else {
		echo "Error: " . $checkquery . "<br>" . $conn->error;
	}
	//Second, send email to sales if rating is lower than 5.5
	if ($CompanyRating >= 5.5) {
		// Do nothing. rating is higher than 5.5		
		}
		elseif ($CompanyRating < 5.5) {
			//Send email to client and admin
			if(!$mail->send()) {
				echo 'Message could not be sent.';
				echo 'Mailer Error: ' . $mail->ErrorInfo;
			} else {
				echo 'Message has been sent';
			}
			
		}	
}

	



