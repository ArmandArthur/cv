

$(function () {
	$('.progress-bar').each(function(iteration, element){
		var element = $(element);
		var tooltip = (element).find('[data-toggle="tooltip"]');
		tooltip.tooltip('hide');
		element.mouseover(function(event)
		{
			updateTooltip(element, tooltip.data('title'));
		});
	});
})


function updateTooltip(element, tooltip) {
    if (element.data('tooltip') != null) {
        element.tooltip('hide');
        element.removeData('tooltip');
    }
    element.tooltip({
        title: tooltip,
        show: true
    });
}

