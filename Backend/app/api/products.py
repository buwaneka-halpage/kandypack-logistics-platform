from fastapi import APIRouter, Depends, HTTPException, status, Security
from sqlalchemy.orm import Session
from typing import Annotated, List
from app.core.database import get_db
from app.core import model, schemas
from app.core.auth import get_current_user

router = APIRouter(prefix="/products")
db_dependency = Annotated[Session, Depends(get_db)]

def check_management_role(current_user: dict):
    if current_user.get("role") != "Management":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Management can perform this operation"
        )

def check_product_access(current_user: dict):
    if current_user.get("role") not in ["Management", "StoreManager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Requires Management or StoreManager role"
        )

@router.get("/", response_model=List[schemas.ProductResponse], status_code=status.HTTP_200_OK)
async def get_all_products(
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Get all products"""
    role = current_user.get("role")
    if role not in ["Management", "StoreManager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    products = db.query(model.Products).all()
    if not products:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No products found"
        )
    return products

@router.get("/{product_id}", response_model=schemas.ProductResponse, status_code=status.HTTP_200_OK)
async def get_product(
    product_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Get details of a specific product"""
    role = current_user.get("role")
    if role not in ["Management", "StoreManager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    product = db.query(model.Products).filter(
        model.Products.product_type_id == product_id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    return product

@router.post("/", response_model=schemas.ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product: schemas.ProductCreate,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Create a new product (requires StoreManager or Management role)"""
    role = current_user.get("role")
    if role not in ["Management", "StoreManager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    # Check if product with same name exists
    existing_product = db.query(model.Products).filter(
        model.Products.product_name == product.product_name
    ).first()
    
    if existing_product:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this name already exists"
        )
    
    try:
        # Validate space consumption rate
        if product.space_consumption_rate <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Space consumption rate must be greater than 0"
            )
        
        # Create new product
        new_product = model.Products(
            product_name=product.product_name,
            space_consumption_rate=product.space_consumption_rate
        )
        
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/{product_id}", response_model=schemas.ProductResponse, status_code=status.HTTP_200_OK)
async def update_product(
    product_id: str,
    product_update: schemas.ProductUpdate,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Update product details (requires Management role)"""
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    
    # Check if product exists
    product = db.query(model.Products).filter(
        model.Products.product_type_id == product_id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    try:
        # Update product name if provided
        if product_update.product_name is not None:
            # Check if another product has the same name
            existing_product = db.query(model.Products).filter(
                model.Products.product_name == product_update.product_name,
                model.Products.product_type_id != product_id
            ).first()
            
            if existing_product:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Product with this name already exists"
                )
            
            product.product_name = product_update.product_name
        
        # Update space consumption rate if provided
        if product_update.space_consumption_rate is not None:
            if product_update.space_consumption_rate <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Space consumption rate must be greater than 0"
                )
            product.space_consumption_rate = product_update.space_consumption_rate
        
        db.commit()
        db.refresh(product)
        return product
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.delete("/{product_id}", status_code=status.HTTP_200_OK)
async def delete_product(
    product_id: str,
    db: db_dependency,
    current_user: dict = Depends(get_current_user)
):
    """Delete a product (requires Management role)"""
    role = current_user.get("role")
    if role not in ["Management"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access Routes"
        )
    
    
    # Check if product exists
    product = db.query(model.Products).filter(
        model.Products.product_type_id == product_id
    ).first()
    
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID {product_id} not found"
        )
    
    # Check if product is used in any order items
    order_items = db.query(model.OrderItems).filter(
        model.OrderItems.product_type_id == product_id
    ).first()
    
    if order_items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete product that is used in orders"
        )
    
    try:
        db.delete(product)
        db.commit()
        return {"detail": f"Product {product_id} deleted successfully"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
