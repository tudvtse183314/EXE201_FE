# Pet Profile API Update Summary

## ✅ Changes Made

### 1. **Updated src/api/petProfile.js**
Added three new endpoints:

#### New Functions Added:
1. `getPetProfilesByUserId(userId)` 
   - GET `/pet-profiles/user/{userId}`
   - Lấy tất cả hồ sơ thú cưng của một user cụ thể

2. `getPetProfilesByType(petType)`
   - GET `/pet-profiles/type/{petType}`
   - Lấy hồ sơ thú cưng theo loại (Dog, Cat, etc.)

3. `getAllPetProfiles()`
   - GET `/pet-profiles/getAll`
   - Lấy tất cả hồ sơ thú cưng (dành cho Admin)

### 2. **Created src/services/petProfiles.js**
New service file following the same pattern as `products.js`:

#### Complete API Functions:
- `getPetById(id)` - GET pet by ID
- `updatePetById(id, data)` - PUT update pet
- `deletePetById(id)` - DELETE pet
- `createPet(body)` - POST create new pet
- `getPetsByUserId(userId)` - GET pets by user ID
- `getPetsByType(petType)` - GET pets by type
- `getMyPets()` - GET current user's pets
- `getAllPets()` - GET all pets (Admin)

#### Grouped Export:
```javascript
export const petProfileApi = {
  getById: getPetById,
  updateById: updatePetById,
  deleteById: deletePetById,
  create: createPet,
  getByUserId: getPetsByUserId,
  getByType: getPetsByType,
  getMyPets,
  getAll: getAllPets,
};
```

## 📋 API Endpoints Summary

### Existing Endpoints (Already in src/api/petProfile.js):
1. ✅ POST `/pet-profiles` - Create pet
2. ✅ GET `/pet-profiles/{id}` - Get pet by ID
3. ✅ PUT `/pet-profiles/{id}` - Update pet
4. ✅ DELETE `/pet-profiles/{id}` - Delete pet
5. ✅ GET `/pet-profiles/my-pets` - Get my pets

### New Endpoints Added:
6. ✅ GET `/pet-profiles/user/{userId}` - Get pets by user
7. ✅ GET `/pet-profiles/type/{petType}` - Get pets by type
8. ✅ GET `/pet-profiles/getAll` - Get all pets (Admin)

## 🎯 Usage Examples

### Using src/api/petProfile.js (Original):
```javascript
import { 
  createPetProfile, 
  getMyPets, 
  getPetProfileById,
  updatePetProfile,
  deletePetProfile,
  getPetProfilesByUserId,  // NEW
  getPetProfilesByType,     // NEW
  getAllPetProfiles         // NEW
} from '../api/petProfile';

// Get all pets for a specific user
const userPets = await getPetProfilesByUserId(123);

// Get all dogs
const dogs = await getPetProfilesByType('Dog');

// Get all pets (Admin only)
const allPets = await getAllPetProfiles();
```

### Using src/services/petProfiles.js (New):
```javascript
import { petProfileApi } from '../services/petProfiles';

// Get all pets for a specific user
const userPets = await petProfileApi.getByUserId(123);

// Get all dogs
const dogs = await petProfileApi.getByType('Dog');

// Get all pets (Admin only)
const allPets = await petProfileApi.getAll();

// Get current user's pets
const myPets = await petProfileApi.getMyPets();
```

## 🔐 Access Control

- **Public**: None (all endpoints require authentication)
- **Customer**: Create, read, update, delete own pets
- **Admin**: All endpoints including `/getAll`

## 📊 Pet Profile Schema

```typescript
interface PetProfile {
  petId: number;
  userId: number;
  petName: string;
  petType: string;        // e.g., "Dog", "Cat"
  breed: string;
  birthDate: string;       // ISO date format
  weight: number;
  healthNotes: string;
  imageUrl: string;
  createdAt: string;       // ISO date format
}
```

## 🐕 Pet Types
Common pet types include:
- Dog
- Cat
- Bird
- Rabbit
- Hamster
- etc.

## 🚀 Error Handling

All functions include comprehensive error handling:
- 401: Authentication required
- 403: Permission denied
- 404: Pet not found
- 400: Invalid data

## 📁 Files Modified

1. ✅ `src/api/petProfile.js` - Added 3 new functions
2. ✅ `src/services/petProfiles.js` - New service file created

## 🎉 Benefits

1. **Consistency**: New service follows same pattern as products service
2. **Completeness**: All API endpoints now covered
3. **Flexibility**: Two ways to use the API (api/ folder for direct imports, services/ for grouped)
4. **Error Handling**: Comprehensive error messages in Vietnamese
5. **Type Safety**: Clear JSDoc comments for all functions


