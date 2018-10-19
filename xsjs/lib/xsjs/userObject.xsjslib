var shine = {};
shine.usercrud = {};
shine.usercrud.User = function(){
    this.id = "";
    this.firstName = "";
    this.lastName = "";
    this.email = "";
};
shine.usercrud.User.prototype.getId = function(){
    return this.id;
};
shine.usercrud.User.prototype.getFirstName = function(){
    return this.firstName;
};
shine.usercrud.User.prototype.getLastName = function(){
    return this.LastName;
};
shine.usercrud.User.prototype.getEmail = function(){
    return this.email;
};
shine.usercrud.User.prototype.setId = function(id){
//    this.id = id;
};
shine.usercrud.User.prototype.setFirstName = function(firstName){
    this.firstName = firstName;
};
shine.usercrud.User.prototype.setLastName = function(lastName){
    this.lastName = lastName;
};
shine.usercrud.User.prototype.setEmail = function(email){
    this.email = email;
};
shine.usercrud.User.prototype.persistIntoTable = function(){
    try{
        var connection = $.hdb.getConnection();
        var query = "";
        // var query = 'select "userSeqId".NEXTVAL as "UserId" from dummy';
        // var rs = connection.executeQuery(query);
        // var persNo = '';
        // if(rs.length > 0) {
        //     persNo = rs[0].UserId;
        // }
        query = "insert into \"UserData.User\"  (\"FirstName\", \"LastName\", \"Email\") values(?,?,?)";
        connection.executeUpdate(query, this.firstName, this.lastName, this.email);
        connection.commit();
        connection.close();
        return true;
    }catch(e){
        return false;
    }
};