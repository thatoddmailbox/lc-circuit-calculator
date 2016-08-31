Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function getValue(id) {
	return new Big($("#" + id).val()).mul($("#" + id + "-unit").val());
}

function setValue(val, id) {
	$("#" + id).val(val.div($("#" + id + "-unit").val()).toPrecision(5));
}

var toCalculate = "capacitance";
$(document).ready(function() {
	var calculate = function() {
		var result = new Big(1);
		if (toCalculate == "frequency") {
			// 1 / (2 * pi * sqrt(inductance * capacitance))
			var l_c = new Big(getValue("inductance")).mul(getValue("capacitance")).sqrt();
			var denom = new Big(2).mul(Math.PI).mul(l_c);
			result = result.div(denom);
		} else if (toCalculate == "inductance") {
			// 1 / (4 * pi^2 * frequency^2 * capacitance)
			var denom = new Big(4).mul(Math.PI).mul(Math.PI).mul(getValue("frequency")).mul(getValue("frequency")).mul(getValue("capacitance"));
			result = result.div(denom);
		} else if (toCalculate == "capacitance") {
			// 1 / (4 * pi^2 * frequency^2 * inductance)
			var denom = new Big(4).mul(Math.PI).mul(Math.PI).mul(getValue("frequency")).mul(getValue("frequency")).mul(getValue("inductance"));
			result = result.div(denom);
		}
		setValue(result, toCalculate);
	};

	$(".field select").each(function() {
		$(this).data("old-value", $(this).val());
	});

	$(".select-field").click(function() {
		var fields = ["frequency", "inductance", "capacitance"];
		fields.remove($(this).attr("data-field"));
		$(fields).each(function() {
			$("[data-field=" + this + "]").html("&laquo; Calculate");
			$("[data-field=" + this + "]").prop("disabled", false);
			$("#" + this).prop("disabled", false);
		});
		$("[data-field=" + $(this).attr("data-field") + "]").html("Calculating");
		$("[data-field=" + $(this).attr("data-field") + "]").prop("disabled", true);
		$("#" + $(this).attr("data-field")).prop("disabled", true);
		toCalculate = $(this).attr("data-field");
	});

	$(".field input").change(calculate);
	$(".field input").keyup(calculate);

	$(".field select").change(function(e) {
		var fieldToSet = $(e.target).attr("id").split("-")[0];
		var oldUnit = $(e.target).data("old-value");
		var newUnit = $(e.target).val();
		var oldNum = new Big($("#" + fieldToSet).val());
		var newNum = oldNum.mul(oldUnit).div(newUnit);
		$("#" + fieldToSet).val(newNum);
		$(e.target).data("old-value", newUnit);
	});
});
