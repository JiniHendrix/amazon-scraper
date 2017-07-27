module.exports = function Item(
  listingUrl,
  prodName,
  price,
  weight,
  dimensions,
  rank,
  imgLink) {
  this.listingUrl = listingUrl;
  this.prodName = prodName;
  this.price = price;
  this.weight = weight;
  this.dimensions = dimensions;
  this.rank = rank;
  this.imgLink = imgLink;
};
