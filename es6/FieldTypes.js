/**
 * Field type to represet Date encoded in JSON.
 *
 * Usage: {createdAt: Date(new Date)}
 */
const Date = (date)=>({__type:'Date', iso: JSON.stringify(date)})

/**
 * Field type to represet a base64 encoded bytes array.
 *
 * Usage: {image: Bytes("base64:xxxxx")}
 */
const Bytes = (base64Str)=>({__type:'Bytes', base64: base64Str})

/**
 * Field type to store a pointer to data in another collection. It is used to represent
 * hasOne relation
 *
 * Usage: {author: Pointer('User')('1')}
 */
const Pointer = (className)=> (objectId)=> ({__type: "Pointer", className, objectId})

/**
 * Field type to store a relation with data in another collection. It is used to represent
 * hasMany relation
 */
const Relation = (className)=>({__type: "Relation", className})


/**
 * Determine the path of a type
 */
const pathOf = (type)=> {
  return type[0] === '_' ? `/${type.substring(1).toLowerCase()}s`:`/classes/${type}`;
}

module.exports = {
  Date, Bytes, Pointer, pathOf
}
