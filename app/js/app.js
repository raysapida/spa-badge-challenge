$.ready(function () {
  $.ajax({
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

  window.addEventListener('hashchange', function(){
    if (!location.toString().match(/\#/)) {
      miniQuery('#index').show();
      miniQuery('#show').hide();
    } else {
      miniQuery('#index').hide();
      miniQuery('#show').show();
      var theTemplateScript = miniQuery("#teacher-badge-template").select()[0].innerHTML;
      var theTemplate = Handlebars.compile(theTemplateScript);
      var name = location.toString().split('#')[1]//.match(/\#.*/)
      var context = { name: name}
      var theCompiledHtml = theTemplate(context);
      miniQuery('#show').select()[0].innerHTML = theCompiledHtml;
    }
    console.log(location);
  })


});
