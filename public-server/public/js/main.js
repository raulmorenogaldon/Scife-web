$('.nav li').click(function(e) {
  var $this = $(this);
  if (!$this.hasClass('active')) {
    $this.addClass('active');
  }
  $('.nav li').not($this).removeClass("active");
  e.preventDefault();
});