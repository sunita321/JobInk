<html>
 
<script type="text/javascript">
var APIKey = "348469475547672";

var jobTitle = "web+developer";

var jobLocation = "orlando"

// Here we are building the URL we need to query the database
var queryURL = "http://api.indeed.com/ads/apisearch?publisher=" + APIKey + "&q=" + jobTitle + "&l=" + jobLocation + "&sort=&radius=&st=&jt=&start=&limit=&fromage=&filter=&latlong=1&co=us&chnl=&userip=1.2.3.4&useragent=Mozilla/%2F4.0%28Firefox%29&v=2&format=json";

// Here we run our AJAX call to Indeed API
$.ajax({url: queryURL, method: 'GET'})
// We store all of the retrieved data inside of an object called "response"
.done(function(jobResults) {
  // Log the queryURL
  console.log(queryURL);
  // Log the resulting object
  console.log(jobResults);

  </script>

 </html>