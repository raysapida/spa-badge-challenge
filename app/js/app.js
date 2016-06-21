$.ready(function () {
  miniQuery.ajax({
    url: 'http://spa-badge-api.herokuapp.com/teachers',
    type: 'GET'
  }).then(function(response){
    var teachers = JSON.parse(response);
    var theTemplateScript = miniQuery("#teacher-template").select()[0].innerHTML;
    var theTemplate = Handlebars.compile(theTemplateScript);
    var context = { teachers: teachers}
    var theCompiledHtml = theTemplate(context);
    miniQuery('.teachers-placeholder').select()[0].innerHTML = theCompiledHtml;
  }).catch(function(response) {
    console.log(response);
  })


  // // Grab the template script
  // var theTemplateScript = miniQuery("#teacher-template").select()[0].innerHTML;
  // // Compile the template
  // var theTemplate = Handlebars.compile(theTemplateScript);

  // // Define our data object
  // var context={
  //   "city": "London",
  //   "street": "Baker Street",
  //   "number": "221B"
  // };

  // // Pass our data to the template
  // var theCompiledHtml = theTemplate(context);

  // // Add the compiled html to the page
  // miniQuery('.content-placeholder').innerHTML = theCompiledHtml;
});
