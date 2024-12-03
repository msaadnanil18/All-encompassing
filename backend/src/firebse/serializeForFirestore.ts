import mongoose from 'mongoose';

export const serializeForFirestore = (
  obj: any,
  seen = new WeakSet(),
  depth = 0,
  maxDepth = 10
): any => {
  if (depth > maxDepth) {
    return null;
  }
  if (obj && typeof obj === 'object') {
    if (seen.has(obj)) {
      return null;
    }
    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        serializeForFirestore(item, seen, depth + 1, maxDepth)
      );
    }

    return Object.fromEntries(
      Object.entries(obj)
        .map(([key, value]) => [
          key,
          typeof value === 'function'
            ? undefined
            : value instanceof mongoose.Types.ObjectId
              ? value.toString()
              : serializeForFirestore(value, seen, depth + 1, maxDepth),
        ])
        .filter(([_, value]) => value !== undefined)
    );
  }
  return obj;
};

export const sanitizeMongooseDoc = (doc: any): any => {
  return doc.toObject ? doc.toObject() : doc;
};
