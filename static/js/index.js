function generateRatingData(randomSelection) {
    // generate array of [category axis, rating] arrays
    var data = Array.apply(0, Array(16)).map(function(category, i) {
        var axis = 0.393 * i;
        var rating;
        if (randomSelection) {
            rating = Math.floor(Math.random() * (6 - 1) + 1);
        } else { rating = 1; }
        return [axis, rating];
    });
    return data;
}

var categories = [
    'Alcohol', 'Fruit (ester)', 'Citrus', 'Hops',
    'Floral', 'Spice', 'Herbal', 'Malt',
    'Toffee', 'Roast', 'Sweet', 'Sour',
    'Bitterness', 'Astringency', 'Body', 'Linger'
];

var labels = d3.range(0, 360, 22.5).map(function(degree, i) {
    var label = categories[i];
    return {'degree': degree, 'label': label};
});

var width = 600,
    height = 450,
    radius = Math.min(width, height) / 2 - 30;

var color = d3.scale.category20();

var r = d3.scale.linear()
    .domain([0, 5])
    .range([0, radius]);

// converts an x, y coord pair into polar coord
var line = d3.svg.line.radial()
    .radius(function(d) { return r(d[1]); })
    .angle(function(d) { return -d[0] + Math.PI / 2; })
    .interpolate("monotone");

var svg = d3.select(".wheel").append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var gr = svg.append("g")
    .attr("class", "r axis")
  .selectAll("g")
    .data(r.ticks(5).slice(1))
  .enter().append("g");

gr.append("circle")
    .attr("r", r);

// gr.append("text") // rating score labels
//     .attr("y", function(d) { return -r(d) - 4; })
//     .attr("transform", "rotate(11.25)")
//     .style("text-anchor", "middle")
//     .text(function(d) { return d - 1; });

var ga = svg.append("g")
    .attr("class", "a axis")
  .selectAll("g")
    .data(labels)
  .enter().append("g")
    .attr("transform", function(d) { return "rotate(" + -d.degree + ")"; });

ga.append("line") // rating axes lines
    .attr("x2", radius);

ga.append("text")
    .attr("x", radius + 12) // centering at the middle
    .attr("dy", ".35em")
    .attr("transform", function(d) {
        return d.degree <= 180 ?
            "rotate(90 " + (radius + 14) + ",0)" :
            "rotate(270 " + (radius + 12) + ",0)";
    })
    .style("text-anchor", "middle")
    .text(function(d) { return d.label; });

function drawRatingsPath(data) {
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", function(d) { return line(d) + "Z";})
        .style("fill", function() {
            return "hsl(" + Math.random() * 360 + ",100%,50%)";
        });
}

var data = generateRatingData(false);
drawRatingsPath(data);
updateCategoryRatings(data);
// svg.select("path").remove();



function updateCategoryRatings(data) {
    $('.category-ratings').html('<tr><td class="header">Category</td>' +
    '<td class="header">Rating</td></tr>');
    data.forEach(function(coord, i) {
        $('.category-ratings').append('<tr><td class="category-cell">' +
            categories[i] + '</td><td class="rating-cell">' + (coord[1] - 1) +
            '</td></tr>');
    });
}

$('#random-wheel').click(function() {
    svg.select("path").remove();
    var data = generateRatingData(true);
    drawRatingsPath(data);
    updateCategoryRatings(data);
});


