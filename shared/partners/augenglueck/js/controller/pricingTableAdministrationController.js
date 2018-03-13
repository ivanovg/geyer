(function () {
    'use strict';

    app.controller('pricingTableAdministrationController', ['$scope', '$location', '$uibModal',
        function ($scope, $location, $uibModal) {
            // NEW CODE

            // TEST DATA
            // =========================================================================================================
            // companies' price lists
            $scope.makers = [
                {name: "optovision GmbH", index: "0", products: [
                        {name: "Gleitsicht G2 Reg AS Photo 400", code: "E54PB", refractivity: 1.5, price: {purchase: 520, retail: 745}},
                        {name: "Gleitsicht G2 Reg AS", code: "E16", refractivity: 1.6, price: {purchase: 400, retail: 575}},
                        {name: "Gleitsicht G3 Reg", code: "KMX350", refractivity: 1.5, price: {purchase: 750, retail: 944}},
                        {name: "Gleitsicht G3 Reg", code: "KM 360", refractivity: 1.6, price: {purchase: 750, retail: 1092}},
                        {name: "Gleitsicht G3 Reg", code: "KM 367", refractivity: 1.67, price: {purchase: 1000, retail: 1239}},
                        {name: "Gleitsicht G4+", code: "FPY15", refractivity: 1.5, price: {purchase: 750, retail: 968}},
                        {name: "Gleitsicht G4+", code: "FPY16", refractivity: 1.6, price: {purchase: 750, retail: 1116}},
                        {name: "Gleitsicht G4+", code: "FPY67", refractivity: 1.67, price: {purchase: 900, retail: 1263}},
                        {name: "Gleitsicht G5+", code: "DPY15", refractivity: 1.5, price: {purchase: 950, retail: 1247}},
                        {name: "Gleitsicht G5+", code: "DPY16", refractivity: 1.6, price: {purchase: 1100, retail: 1336}},
                        {name: "Gleitsicht G5+", code: "DPY67", refractivity: 1.67, price: {purchase: 1200, retail: 1486}},
                        {name: "Gleitsicht G6+", code: "WLY15", refractivity: 1.5, price: {purchase: 1050, retail: 1317}},
                        {name: "Gleitsicht G6+", code: "WLY16", refractivity: 1.6, price: {purchase: 1200, retail: 1427}},
                        {name: "Gleitsicht G6+", code: "WLY67", refractivity: 1.67, price: {purchase: 1250, retail: 1569}}
                    ]},
                {name: "Zeiss", index: "1", products: [
                        {name: "Zeiss Markenglas inkl. DuraVision Platinum", code: 1234, refractivity: 1.5, price: {purchase: 150, retail: 250}},
                        {name: "Zeiss Markenglas inkl. DuraVision Platinum", code: 1234, refractivity: 1.6, price: {purchase: 180, retail: 280}},
                        {name: "Zeiss Markenglas inkl. DuraVision Platinum", code: 1234, refractivity: 1.67, price: {purchase: 250, retail: 350}},
                        {name: "Zeiss Markenglas inkl. DuraVision Platinum", code: 1234, refractivity: 1.74, price: {purchase: 450, retail: 550}},
                        {name: "Zeiss Markenglas inkl. LotuTec", code: 1235, refractivity: 1.5, price: {purchase: 100, retail: 170}},
                        {name: "Zeiss Markenglas inkl. LotuTec", code: 1235, refractivity: 1.6, price: {purchase: 120, retail: 200}},
                        {name: "Zeiss Markenglas inkl. LotuTec", code: 1235, refractivity: 1.67, price: {purchase: 170, retail: 250}},
                        {name: "Zeiss Markenglas inkl. LotuTec", code: 1235, refractivity: 1.74, price: {purchase: 370, retail: 450}},
                        {name: "Synchrony inkl. HMC+", code: 1236, refractivity: 1.5, price: {purchase: 50, retail: 100}},
                        {name: "Synchrony inkl. HMC+", code: 1236, refractivity: 1.6, price: {purchase: 70, retail: 120}},
                        {name: "Synchrony inkl. HMC+", code: 1236, refractivity: 1.67, price: {purchase: 120, retail: 200}},
                        {name: "Synchrony inkl. HMC+", code: 1236, refractivity: 1.74, price: {purchase: 200, retail: 300}}
                    ]},
                {name: "Seiko", index: "2", products: [
                        {name: "Seiko Platinum", code: 4321, refractivity: 1.5, price: {purchase: 120, retail: 200}},
                        {name: "Seiko Platinum", code: 4321, refractivity: 1.6, price: {purchase: 150, retail: 250}},
                        {name: "Seiko Platinum", code: 4321, refractivity: 1.67, price: {purchase: 220, retail: 320}},
                        {name: "Seiko Platinum", code: 4321, refractivity: 1.74, price: {purchase: 370, retail: 520}},
                        {name: "Seiko Gold", code: 4321, refractivity: 1.5, price: {purchase: 90, retail: 170}},
                        {name: "Seiko Gold", code: 4321, refractivity: 1.6, price: {purchase: 110, retail: 220}},
                        {name: "Seiko Gold", code: 4321, refractivity: 1.67, price: {purchase: 180, retail: 250}},
                        {name: "Seiko Gold", code: 4321, refractivity: 1.74, price: {purchase: 320, retail: 430}},
                        {name: "Seiko Silver", code: 4321, refractivity: 1.5, price: {purchase: 55, retail: 110}},
                        {name: "Seiko Silver", code: 4321, refractivity: 1.6, price: {purchase: 60, retail: 120}},
                        {name: "Seiko Silver", code: 4321, refractivity: 1.67, price: {purchase: 110, retail: 190}},
                        {name: "Seiko Silver", code: 4321, refractivity: 1.74, price: {purchase: 200, retail: 320}}
                    ]}
            ];

            // optician's price list
            $scope.priceList = [
                {category: "Einstärken", glasses: [
                        {refractivity: 1.74, quality: [
                                {category: "Premium", name: "Optilenti Optolux", price: {purchase: 900, retail: 1300, uvp: 1300}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1100}},
                                {category: "Asphärisch", name: "Orgalit Premium", price: {purchase: 640, retail: 820, uvp: 820}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Produkt 1", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Produkt 2", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Einstieg", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.67, quality: [
                                {category: "Premium", name: "O'Design Plus Sht Org", price: {purchase: 1400, retail: 1880, uvp: 1880}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Asphärisch", name: "O'Design Minus Short Orgalit", price: {purchase: 1250, retail: 1520, uvp: 1520}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1250}},
                                {category: "Top Produkt 1", name: "O'Clever GL Free S Trans Sig Br", price: {purchase: 600, retail: 870, uvp: 870}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Produkt 2", name: "O'Clever GL Free Med Photo 400 Br", price: {purchase: 450, retail: 770, uvp: 770}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Einstieg", name: "O'Clever GL Free Regular", price: {purchase: 350, retail: 459, uvp: 459}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.6, quality: [
                                {category: "Premium", name: "O'Design Optolux", price: {purchase: 800, retail: 1150, uvp: 1150}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Asphärisch", name: "O'Design Minus Short Orgalit", price: {purchase: 700, retail: 1050, uvp: 1050}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Produkt 1", name: "O'Clever GL Free S Trans Sig Br", price: {purchase: 550, retail: 880, uvp: 880}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 700}},
                                {category: "Top Produkt 2", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Einstieg", name: "O'Clever GL Free Regular", price: {purchase: 300, retail: 420, uvp: 420}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.5, quality: [
                                {category: "Premium", name: "O'Design You Org. DriveWear", price: {purchase: 1200, retail: 1570, uvp: 1570}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Asphärisch", name: "O'Design Minus Short Orgalit", price: {purchase: 700, retail: 1050, uvp: 1050}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 950}},
                                {category: "Top Produkt 1", name: "O'Clever GL Free S Trans Sig Br", price: {purchase: 550, retail: 870, uvp: 870}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Produkt 2", name: "O'Clever GL Free Med Photo 400 Br", price: {purchase: 450, retail: 670, uvp: 670}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Top Einstieg", name: "O'Clever GL Free Regular", price: {purchase: 320, retail: 450, uvp: 450}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]}
                    ]},
                {category: "Gleitsicht", glasses: [
                        {refractivity: 1.74, quality: [
                                {category: "G6", name: "Gleitsicht G6+", price: {purchase: 1350, retail: 1650, uvp: 1650}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1350}},
                                {category: "G5", name: "Gleitsicht G5+", price: {purchase: 1225, retail: 1569, uvp: 1569}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G4", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G3", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G2", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.67, quality: [
                                {category: "G6", name: "Gleitsicht G6+", price: {purchase: 1300, retail: 1569, uvp: 1569}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G5", name: "Gleitsicht G5+", price: {purchase: 1200, retail: 1486, uvp: 1486}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G4", name: "Gleitsicht G4+", price: {purchase: 1050, retail: 1263, uvp: 1263}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G3", name: "Gleitsicht G3 Sht", price: {purchase: 1050, retail: 1239, uvp: 1239}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1050}},
                                {category: "G2", name: "O'Free Reg Org", price: {purchase: 450, retail: 685, uvp: 685}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.6, quality: [
                                {category: "G6", name: "Gleitsicht G6+", price: {purchase: 1200, retail: 1427, uvp: 1427}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G5", name: "Gleitsicht G5+", price: {purchase: 1100, retail: 1336, uvp: 1336}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1200}},
                                {category: "G4", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G3", name: "Gleitsicht G3 Sht", price: {purchase: 800, retail: 1092, uvp: 1092}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G2", name: "Gleitsicht G2 Reg AS", price: {purchase: 400, retail: 575, uvp: 575}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.5, quality: [
                                {category: "G6", name: "Gleitsicht G6+", price: {purchase: 1100, retail: 1317, uvp: 1317}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1150}},
                                {category: "G5", name: "Gleitsicht G5+", price: {purchase: 1000, retail: 1247, uvp: 1247}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G4", name: "Gleitsicht G4+", price: {purchase: 800, retail: 968, uvp: 968}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G3", name: "Gleitsicht G3 Sht", price: {purchase: 770, retail: 944, uvp: 944}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "G2", name: "Gleitsicht G2 Reg AS", price: {purchase: 300, retail: 450, uvp: 450}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]}
                    ]},
                {category: "Arbeitsplatz", glasses: [
                        {refractivity: 1.74, quality: [
                                {category: "Raumgläser 1", name: "I'VISION You Org.", price: {purchase: 1400, retail: 1744, uvp: 1744}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1500}},
                                {category: "Raumgläser 2", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: 0}},
                                {category: "Raumgläser 3", name: "O'Design You Org", price: {purchase: 1000, retail: 1250, uvp: 1250}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Simple Office", name: "O'Free You Org", price: {purchase: 700, retail: 950, uvp: 950}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.67, quality: [
                                {category: "Raumgläser 1", name: "I'VISION You Org.", price: {purchase: 1400, retail: 1650, uvp: 1650}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1350}},
                                {category: "Raumgläser 2", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Raumgläser 3", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Simple Office", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.6, quality: [
                                {category: "Raumgläser 1", name: "I'VISION You Org.", price: {purchase: 1200, retail: 1500, uvp: 1500}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Raumgläser 2", name: "O'Design You Org", price: {purchase: 1100, retail: 1350, uvp: 1350}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Raumgläser 3", name: "O'Free Sht Org", price: {purchase: 900, retail: 1080, uvp: 1080}, initialized: true, auction: {isSet: true, start: new Date(2018, 6, 1), end: new Date(2018, 6, 14), price: 750}},
                                {category: "Simple Office", name: "O'Free Reg Org", price: {purchase: 450, retail: 760, uvp: 760}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]},
                        {refractivity: 1.5, quality: [
                                {category: "Raumgläser 1", name: "I'VISION You Org.", price: {purchase: 1200, retail: 1350, uvp: 1350}, initialized: true, auction: {isSet: true, start: new Date(2018, 5, 1), end: new Date(2018, 5, 14), price: 1150}},
                                {category: "Raumgläser 2", price: {purchase: -1, retail: -1, uvp: -1}, initialized: false, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Raumgläser 3", name: "O'Free Sht Org", price: {purchase: 740, retail: 980, uvp: 980}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}},
                                {category: "Simple Office", name: "O'Free Reg Org", price: {purchase: 560, retail: 780, uvp: 780}, initialized: true, auction: {isSet: false, start: "", end: "", price: null}}
                            ]}
                    ]}

            ];

            // ===========================================================================================================

            // ========= AUCTION ==================================
            $scope.marginGreen = false;
            $scope.marginOrange = false;
            $scope.marginRed = false;
            $scope.margin = 0;
            $scope.tempPrice = 0;

            $scope.setAuction = function (categoryIndex, glassesIndex, itemIndex) {
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].auction.isSet = true;
            }

            $scope.saveAuction = function (categoryIndex, glassesIndex, itemIndex) {
                $scope.marginGreen = false;
                $scope.marginOrange = false;
                $scope.marginRed = false;
                // $scope.margin = $scope.auctionPriceList[typeIndex].refractivity[refractivityIndex].glasses[glassesIndex].price - $scope.auctionPriceList[typeIndex].refractivity[refractivityIndex].glasses[glassesIndex].purchase;
                // if ($scope.margin >= 50)
                //     $scope.marginGreen = true;
                // else if ($scope.margin < 50 && $scope.margin >= 25)
                //     $scope.marginOrange = true;
                // else
                //     $scope.marginRed = true;
            }

            $scope.deleteAuction = function (categoryIndex, glassesIndex, itemIndex) {
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].auction.isSet = false;
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].auction.start = "";
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].auction.end = "";
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].auction.price = null;
            }
            
            $scope.isAuction = function (value) {
                if (value === true) {
                    return "set";
                } else
                    return "not set";
            }
            // ============================================================================================================

            // ====================== EDIT PRICE LIST DETAILED ==========================================
            $scope.idSelectedItem = null;
            $scope.idSelectedGlasses = null;

            $scope.editPriceListItem = function (idSelectedItem, idSelectedGlasses) {
                $scope.idSelectedItem = idSelectedItem;
                $scope.idSelectedGlasses = idSelectedGlasses;
            }

            $scope.savePriceListItem = function () {
                $scope.idSelectedItem = null;
                $scope.idSelectedGlasses = null;
            }

            $scope.deletePriceListItem = function (categoryIndex, glassesIndex, itemIndex) {
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].name = null;
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].price = {purchase: -1, retail: -1};
                $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].initialized = false;
            }

            $scope.changeCategoryName = function(categoryIndex, glassesIndex, itemIndex) {
                var tempCategory = $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].category;
                $scope.priceList[categoryIndex].glasses.forEach(function (item) {
                    item.quality[itemIndex].category = tempCategory;
                })
            }
            // =============================================================================================================

            // ========================= EDIT PRICE LIST FROM PRODUCER ==================================================
            var productFromProducer = null;
            var draggedElement = null;

            $scope.today = new Date();
            $scope.today.setHours(0, 0, 0, 0);

            $scope.selectProductFromProducer = function(product, event) {
                productFromProducer = product;

                draggedElement = event.target.parentElement.cloneNode(true);

                document.getElementsByTagName("body")[0].appendChild(draggedElement);
                draggedElement.style.position = "absolute";
                draggedElement.style.border = "1px solid lightgray";
                event.preventDefault();
            }

            $scope.replaceProductFromPriceList = function (categoryIndex, glassesIndex, itemIndex) {
                if (productFromProducer.refractivity === $scope.priceList[categoryIndex].glasses[glassesIndex].refractivity) {
                    $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].name = productFromProducer.name;
                    $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].price = {
                        purchase: productFromProducer.price.purchase,
                        retail: productFromProducer.price.retail,
                        uvp: productFromProducer.price.retail
                    };
                    $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].initialized = true;
                    $scope.priceList[categoryIndex].glasses[glassesIndex].quality[itemIndex].auction = {
                        isSet: false,
                        start: "",
                        end: "",
                        price: null
                    };
                }
            }

            $scope.replaceTargetElement = function (event) {
                event.preventDefault();
                event.stopPropagation();
                var changedTouch = event.changedTouches[0];
                var target = draggedElement;
                target.remove();
                var element = document.elementFromPoint(changedTouch.clientX, changedTouch.clientY);
                if (element.className.indexOf("droppable") !== -1) {
                    var classes = element.className.split(" ");
                    var categoryIndex = classes[2].substring(2, classes[2].length);
                    var glassesIndex = classes[3].substring(2, classes[2].length);
                    var itemIndex = classes[4].substring(2, classes[2].length);
                    element.style.background = "#ccc";
                    console.log(element);
                    $scope.replaceProductFromPriceList(categoryIndex, glassesIndex, itemIndex);
                }

            }

            $scope.moveElement = function (event) {
                // Place element where the finger is
                // ghost element
                var touch = event.targetTouches[0];
                draggedElement.style.left = touch.pageX + 'px';
                draggedElement.style.top = touch.pageY + 'px';
                event.preventDefault();
            }

            $scope.dragElement = function (event) {

            }

            $scope.productInfo = function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'templates/ProductInformationModal.html',
                    controller: 'productInformationModalController',
                    size: 'lg'
                });
                modalInstance.result.then(function(){}, function(){});
            }

            $scope.lightGray = function () {
                var emptyElements = document.getElementsByClassName("empty");
                for (var i = 0; i < emptyElements.length; i++) {
                    emptyElements.item(i).parentElement.parentElement.style.background = "rgba(239, 237, 237, 0.98)";
                }
            }

            $scope.setAuctionClass = function () {
                var auctionElements = document.getElementsByClassName("td-auction");
                for (var i = 0; i < auctionElements.length; i++) {
                    auctionElements.item(i).parentElement.style.background = "#e46c0b";
                    auctionElements.item(i).parentElement.style.color = "white";
                }
            }

            $scope.setPriceClass = function () {
                var auctionElements = document.getElementsByClassName("td-price");
                for (var i = 0; i < auctionElements.length; i++) {
                    auctionElements.item(i).parentElement.parentElement.style.background = "#ccc";
                    auctionElements.item(i).parentElement.parentElement.style.color = "black";
                }
            }

            $scope.setEmptyClass = function () {
                var auctionElements = document.getElementsByClassName("td-empty");
                for (var i = 0; i < auctionElements.length; i++) {
                    auctionElements.item(i).parentElement.parentElement.style.background = "rgba(239, 237, 237, 0.98)"
                    auctionElements.item(i).parentElement.parentElement.style.color = "black"
                }
            }

            // $scope.fillGray = function () {
            //     var emptyElements = document.getElementsByClassName("full");
            //     console.log(emptyElements);
            //     for (var i = 0; i < emptyElements.length; i++) {
            //         emptyElements.item(i).parentElement.parentElement.style.background = "#ccc";
            //     }
            // }
            // ==================================================================================================
        }
    ])
        //touch events directives
    .directive('ngTouchstart', ngTouchstart)
    .directive('ngTouchend', ngTouchend)
    .directive('ngTouchmove', ngTouchmove);

    function ngTouchstart() {
        return {
            restrict: 'A',
            scope: true,
            link: function (scope, element, attrs) {
                element.on('touchstart', doTouchstart);

                function doTouchstart(event) {
                    event.preventDefault();

                    scope.$event = event;
                    scope.$apply(attrs.ngTouchstart);
                }
            }
        }
    }

    function ngTouchend() {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                element.on('touchend', doTouchend);

                function doTouchend(event) {
                    event.preventDefault();

                    scope.$event = event;
                    scope.$apply(attrs.ngTouchend);
                }
            }
        }
    }

    function ngTouchmove() {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element, attrs) {
                element.on('touchmove', doTouchend);

                function doTouchend(event) {
                    event.preventDefault();

                    scope.$event = event;
                    scope.$apply(attrs.ngTouchmove);
                }
            }
        }
    }
}());