var db = '';
var dbName = 'AsyncTest';
var dbVersion = '1.0';
var dbDisplayName = 'Test DB';
var dbMaxSize = '2097152'; //2MB (2*1024*1024)
var db = openDatabase(dbName, dbVersion, dbDisplayName, dbMaxSize);  // Open SQLite Database

//Order Header
var createOrdHeaderStatement = "CREATE TABLE IF NOT EXISTS Order_Header (id INTEGER PRIMARY KEY AUTOINCREMENT, order_num TEXT, billto_num TEXT, shipto_num TEXT, po_num TEXT, ref_num TEXT, terms_code TEXT, route_code TEXT, status TEXT )";

var popHeaderStmt = "INSERT INTO Order_Header (order_num, billto_num, shipto_num, po_num, ref_num, terms_code, route_code, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'S')";

var getOrdHeaderSingleStatement = "SELECT * FROM Order_Header WHERE order_num = ? ";
var getSyncableOrdersStatement = "SELECT order_num FROM Order_Header WHERE status = 'S' ORDER BY id";

var purgeOrderHeaderStatement = "DELETE FROM Order_Header";

//Order Detail
var createOrdDetailStatement = "CREATE TABLE IF NOT EXISTS Order_Detail (id INTEGER PRIMARY KEY AUTOINCREMENT, order_num TEXT, line_num INTEGER, part_num TEXT, part_desc TEXT, qty TEXT, price TEXT, line_exception TXT )";

var insertOrdDetStatement = "INSERT INTO Order_Detail (order_num, line_num, part_num, part_desc, qty, price) VALUES (?, ?, ?, ?, ?, ?)";
var getOrderDetStatement = "SELECT id, order_num, line_num, part_num, part_desc, qty, price, line_exception FROM Order_Detail WHERE order_num = ?";
var purgeOrderDetStatement = "DELETE FROM Order_Detail";

//Order Required Fields


//Driver Notes
var createDriverNotesStatement = "CREATE TABLE IF NOT EXISTS Driver_Notes (note_num INTEGER PRIMARY KEY AUTOINCREMENT, order_num TEXT,  notes_txt TEXT, dtstamp TEXT )";
var insertDriverNoteStatement = "INSERT INTO Driver_Notes (order_num, notes_txt, dtstamp) VALUES (?, ?, ?)";
var purgeDriverNotesStatement = "DELETE FROM Driver_Notes";
var getDriverNoteStatment = "SELECT order_num notes_txt, dtstamp FROM Driver_Notes WHERE order_num = ?";



function initDB() {
    db.transaction(function (tx) { tx.executeSql(createOrdHeaderStatement, [], onCreateSuccess, onError); });
    db.transaction(function (tx) { tx.executeSql(createOrdDetailStatement, [], onCreateSuccess, onError); });
    db.transaction(function (tx) { tx.executeSql(createDriverNotesStatement, [], onCreateSuccess, onError); });

    db.transaction(function (tx) { tx.executeSql(purgeOrderHeaderStatement, [], onCreateSuccess, onError); });
    db.transaction(function (tx) { tx.executeSql(purgeOrderDetStatement, [], onCreateSuccess, onError); });        
    db.transaction(function (tx) { tx.executeSql(purgeDriverNotesStatement, [], onCreateSuccess, onError); });    

    db.transaction(function (tx) {tx.executeSql(popHeaderStmt, ['1234', 'bb11', 'aa00', 'PO 1', 'Ref 1', 'COD', 'EA'], onInsertSuccess, onError)});
    db.transaction(function (tx) {tx.executeSql(popHeaderStmt, ['1235', 'cc22', 'aa01', 'PO 2', 'Ref 2', '90D', 'EA'], onInsertSuccess, onError)});
    db.transaction(function (tx) {tx.executeSql(popHeaderStmt, ['1236', 'dd33', 'aa02', 'PO 3', 'Ref 3', '60D', 'EA'], onInsertSuccess, onError)});
    db.transaction(function (tx) {tx.executeSql(popHeaderStmt, ['1237', 'ee44', 'aa03', 'PO 4', 'Ref 4', 'COD', 'EA'], onInsertSuccess, onError)});



    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1234', 1, '901222', '315/80R22.5 Michelin', '1.0', '301.98'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1234', 2, 'M33222', '245/65R24.5 Michelin', '5.0', '691.93'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1234', 3, '04030', '11R22.5 Michelin Retread', '3.0', '187.57'], onInsertSuccess, onError)});            
    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1235', 1, 'M48118', 'GXZYE Uniroyal TigerPaw', '6.0', '251.43'], onInsertSuccess, onError)});            
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1235', 2, 'TAX', 'Sales Tax', '1.0', '7.57'], onInsertSuccess, onError)});            

    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1236', 1, '90125', '305/80R22.5 BFG', '4.0', '110.98'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1236', 2, '84845', '245/65R24.5 Michelin Retread', '1.0', '192.93'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1236', 3, '04030', '11R22.5 Michelin Retread', '1.0', '187.57'], onInsertSuccess, onError)});            
    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1237', 1, 'U55513', '215/80R22.5 uniroyal', '3.0', '405.98'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1237', 2, '98875', 'XDC 22 11R22.5 Retread', '1.0', '192.93'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertOrdDetStatement, ['1237', 3, '04030', '11R22.5 Michelin Retread', '2.0', '196.27'], onInsertSuccess, onError)});                


    db.transaction(function (tx) {tx.executeSql(insertDriverNoteStatement, ['1234', 'Great Burgers', '2012-12-13 11:09:33 AM EST'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertDriverNoteStatement, ['1235', 'No one home', '2012-12-13 09:57:33 AM EST'], onInsertSuccess, onError)});    
    db.transaction(function (tx) {tx.executeSql(insertDriverNoteStatement, ['1236', 'Big Dog', '2012-12-12 04:12:53 PM EST'], onInsertSuccess, onError)});
    db.transaction(function (tx) {tx.executeSql(insertDriverNoteStatement, ['1237', 'No Problems', '2012-12-13 12:01:33 PM EST'], onInsertSuccess, onError)});    

    
}

function onCreateSuccess() // Function for Handling Error...

{

    console.log('success creating');

}

function onInsertSuccess() // Function for Handling Error...

{

    return true

}

function onError(tx, error) // Function for Handeling Error...

{
    alert(error.message);
}





var orderArray = [];
/*
Thanks to Josh Ross's answer here for how to do SQL transactions that return a deferred object
http://stackoverflow.com/questions/8058679/wrapping-websql-executesql-calls-in-a-jquery-deferred-promise

*/
function successWrapper(d) {
    //console.log(d);
    return (function (tx, data) {
        d.resolve(data)
                
    })
};

function failureWrapper(d) {
    console.log("Sql failed");
    return (function (tx, error) {
        d.reject(error)
    })
};    



function getMyOrdersSQL() {
    return $.Deferred(function (d) {
        db.transaction(function (tx) {
                        tx.executeSql(getSyncableOrdersStatement, [], 
                        successWrapper(d), failureWrapper(d));
                    });
        });
}


function getHeaderDataSQL(ordernum) {
    return $.Deferred(function (d) {
        db.transaction(function (tx) {
                        tx.executeSql(getOrdHeaderSingleStatement, [ordernum], 
                        successWrapper(d), failureWrapper(d));
                    });
        });
}


function getDetailDataSQL(ordernum) {
    return $.Deferred(function (d) {
        db.transaction(function (tx) {
                        tx.executeSql(getOrderDetStatement, [ordernum], 
                        successWrapper(d), failureWrapper(d));
                    });
        });
}

function getNoteDataSQL(ordernum) {
    return $.Deferred(function (d) {
        db.transaction(function (tx) {
                        tx.executeSql(getDriverNoteStatment, [ordernum], 
                        successWrapper(d), failureWrapper(d));
                    });
        });
}




var ordersArr = [];

function getOrders() {

    $.when(getMyOrdersSQL()).pipe(function(dta) {
        var deferreds = [];
        //build an array of deferred SQL transactions
        //each deferred transaction should populate an order object, then push it into the final ordersArr array
        if (dta.rows.length > 0) {
            for (var i=0; i<dta.rows.length; i++) {
                //console.log(dta.rows.item(i).order_num);
                deferreds.push(getOrdStuff(dta.rows.item(i).order_num)); //push in a function for each order in the getMyOrdersSQL resultset
            }
            $.when.apply(null, deferreds); //run all the deferred functions

        }else {
            console.log(dta.rows);    
            alert("No records found!");
        }
    }).done(function() {
        
    }).fail(function() {
        alert("Failed!");
    });
}

function getOrdStuff(ordernum) {
    console.log(ordernum);
    return $.Deferred(function(d) {
        var orderObj = new Object(); //object to hold the order info
        //getDriverNoteStatment
        //getOrdeDetSingle
        //getOrdHeaderSingleStatement
        
        $.when(getHeaderDataSQL(ordernum), getDetailDataSQL(ordernum), getNoteDataSQL(ordernum)).done(
        function(dta1, dta2, dta3) {
            //dta1 is the deferred promise/result from the getHeaderDataSQL function
            //dta2 is the deferred promise/result from the getDetailDataSQL function
            //dta3 is the deferred promise/result from the getNoteDataSQL function                        
            var orderHeader = dta1.rows.item(0); 

            var orderNotes = dta3.rows.item(0);

            orderObj.order_num = orderHeader.order_num;
            orderObj.status = orderHeader.status;
            orderObj.shipto_num = orderHeader.shipto_num;
            orderObj.po_num = orderHeader.po_num;
            orderObj.billto_num = orderHeader.billto_num;
            
            
            var onObj = new Object(); //order notes object
            orderObj.notes = orderNotes.notes;
            orderObj.notes_dtstamp = orderNotes.dtstamp;

            var odArr = []; //order detail array to hold order line items objects

            for (var k = 0; k<dta2.rows.length; k++) { //loop over line item results
                console.log(dta1.rows.item(0).order_num+' has '+dta2.rows.length+' line items');
                var odObj = new Object();
                var orderDetails = dta2.rows.item(k);
                odObj.line_num = orderDetails.line_num;
                odObj.part_num = orderDetails.part_num;
                odObj.qty = orderDetails.qty;
                odObj.part_desc = orderDetails.part_desc;
                odArr.push(odObj); //push each line item object into the detail array
                
            }            
            
            orderObj.lineitems = odArr;
            ordersArr.push(orderObj);
            console.log("got stuff");
            console.log(ordersArr);
            var alertStr = "There are ";
            alertStr += ordersArr.length+' orders in the orderArr array.';
            alert(alertStr);
            return function(d) {
                d.resolve();    //return the promise
            }
            
        }).fail(function(etx, err) {
             d.reject(err, etx) //return the error if any transaction failed
        });
    
        
    });
    
        
}


$(document).ready(function(){
    initDB();

    $("#myButton").click(function() {
        //buildOrderObj();
        getOrders();


    });

});
