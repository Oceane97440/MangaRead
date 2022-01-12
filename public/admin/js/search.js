$(document).ready(function ($) {

    $('#search').autocomplete({
        source: function (req, res) {
            $.ajax({
                url: "autocomplete/",
                dataType: "jsonp",
                type: "GET",
                data: req,

                success: function (data) {
                    console.log(data)


                    res($.map(data, function (item) {


                        return {
                            label: item
                                .title, //text comes from a collection of mongo
                            value: item.manga_id
                        };
                    }));

                },
                error: function (err) {
                    alert(err.status + ' : ' + err.statusText);
                }
            });
        },
        minLength: 1,
        select: function (event, ui) {
            // alert("selected!");

            // console.log(event)
            // console.log(ui)


            if (ui.item) {
                // $('#search').val(ui.item.manga_id)
                window.location.replace('http://127.0.0.1:8890/mangas/fiche/' + ui.item
                    .value);


            }
        }
    });
})