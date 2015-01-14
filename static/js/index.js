var categories = {
    'Alcohol': 0, 'Fruity ester': 1, 'Citrus': 2, 'Hops': 3,
    'Flowers': 4, 'Spice': 5, 'Herbal': 6, 'Malt': 7,
    'Toffee': 8, 'Roast': 9, 'Sweet': 10, 'Sour': 11,
    'Bitterness': 12, 'Astringency': 13, 'Body': 14, 'Linger': 15
};

var categoryKeys = Object.keys(categories);

var labels = d3.range(0, 360, 22.5).map(function(degree, i) {
    var label = categoryKeys[i];
    return {'degree': degree, 'label': label};
});

var width = 500,
    height = 450,
    radius = Math.min(width, height) / 2 - 30;

var r = d3.scale.linear()
    .domain([0, 5])
    .range([0, radius]);

// converts an array of x, y coord pair into polyline coords
var line = d3.svg.line.radial()
    .radius(function(d) { return r(d[1]); })
    .angle(function(d) { return -d[0] + Math.PI / 2; })
    .interpolate("monotone");

var svg = d3.select(".wheel").append("svg")
        .attr("width", width)
        .attr("height", height)
    .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

function generateRatingsPath() {
    var ratingsPath = Array.apply(0, Array(16)).map(function(category, i) {
        var axis = 0.393 * i;
        var rating = 1;
        return [axis, rating];
    });
    return ratingsPath;
}

function updateRatingsPath(ratingsPath, category, rating) {
    // updates a category in the RatingPath array
    var index = categories[category];
    ratingsPath[index][1] = rating;
    return ratingsPath;
}

function drawRings() {
    var gr = svg.append("g")
            .attr("class", "r axis")
        .selectAll("g")
            .data(r.ticks(5).slice(1))
        .enter().append("g");

    gr.append("circle")
        .attr("class", "rating-circle")
        .attr("r", r);
}

function drawRatingsAxes() {
    var ga = svg.append("g")
            .attr("class", "a axis")
        .selectAll("g")
            .data(labels)
        .enter().append("g")
            .attr("id", function(d, i) { return categoryKeys[i]; })
            .attr("transform", function(d) {
                return "rotate(" + -d.degree + ")";
            });

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

    ga.selectAll('circle')
            .data([[1.5, 1], [1.5, 2], [1.5, 3], [1.5, 4], [1.5, 5]])
        .enter().append("circle")
            .attr('class', 'click-circle')
            .attr('id', function(d, i) {
                return this.parentNode.id + '|' + (d[1] - 1).toString();
            })
            .attr('cx', function(d) { return r(d[1]); })
            .attr('cy', function(d) { return -d[0] + Math.PI / 2; })
            .attr('r', 4);
}

function drawRatingsPath(data) {
    svg.selectAll("path").remove();
    svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", function(d) { return line(d) + "Z"; })
        .style("fill", function() {
            return "hsl(" + Math.random() * 360 + ",100%,50%)";
        });
}

function updateCategoryRatings(data) {
    $('.category-ratings').html('<tr><td class="header">Category</td>' +
    '<td class="header">Rating</td></tr>');
    data.forEach(function(coord, i) {
        $('.category-ratings').append('<tr><td class="category-cell">' +
            categoryKeys[i] + '</td><td class="rating-cell">' + (coord[1] - 1) +
            '</td></tr>');
    });
}

function update(data) {
    drawRatingsPath(data);
    updateCategoryRatings(data);
}

// on page load
drawRings();
drawRatingsAxes();
var data = generateRatingsPath();
update(data);

$('.click-circle').click(function() {
    console.log('hey');
    var info = this.id.split('|');
    var category = info[0];
    var rating = parseInt(info[1], 10) + 1;
    updateRatingsPath(data, category, rating);
    update(data);
});


