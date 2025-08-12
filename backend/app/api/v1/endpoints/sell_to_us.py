from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json

from app.core.database import get_db
from app.models.sell_to_us import PlantSubmission, PlantSubmissionStatus
from app.schemas.sell_to_us import PlantSubmissionCreate, PlantSubmissionResponse, PlantSubmissionUpdate

router = APIRouter()

@router.post("/submit-plant", response_model=PlantSubmissionResponse)
async def submit_plant(
    species: str = Form(...),
    size: str = Form(...),
    age: str = Form(...),
    health: str = Form(...),
    description: Optional[str] = Form(None),
    photos: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """
    Submit a plant for review and potential purchase
    """
    try:
        # Create plant submission
        submission_data = PlantSubmissionCreate(
            species=species,
            size=size,
            age=age,
            health=health,
            description=description,
            status=PlantSubmissionStatus.PENDING,
            submitted_at=datetime.utcnow()
        )
        
        # Save to database
        submission = PlantSubmission(**submission_data.dict())
        db.add(submission)
        db.commit()
        db.refresh(submission)
        
        # TODO: Save photos to storage
        # TODO: Send notification to admin for review
        
        return PlantSubmissionResponse(
            id=submission.id,
            species=submission.species,
            size=submission.size,
            age=submission.age,
            health=submission.health,
            description=submission.description,
            status=submission.status.value,
            submitted_at=submission.submitted_at,
            message="Plant submitted successfully! We'll review it within 24-48 hours."
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit plant: {str(e)}")

@router.get("/submissions/{submission_id}", response_model=PlantSubmissionResponse)
async def get_submission(
    submission_id: int,
    db: Session = Depends(get_db)
):
    """
    Get plant submission details
    """
    submission = db.query(PlantSubmission).filter(PlantSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return PlantSubmissionResponse(
        id=submission.id,
        species=submission.species,
        size=submission.size,
        age=submission.age,
        health=submission.health,
        description=submission.description,
        status=submission.status.value,
        submitted_at=submission.submitted_at,
        reviewed_at=submission.reviewed_at,
        price_offer=submission.price_offer,
        rejection_reason=submission.rejection_reason
    )

@router.get("/submissions", response_model=List[PlantSubmissionResponse])
async def list_submissions(
    status: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """
    List plant submissions (admin only)
    """
    query = db.query(PlantSubmission)
    
    if status:
        query = query.filter(PlantSubmission.status == PlantSubmissionStatus(status))
    
    submissions = query.offset(offset).limit(limit).all()
    
    return [
        PlantSubmissionResponse(
            id=s.id,
            species=s.species,
            size=s.size,
            age=s.age,
            health=s.health,
            description=s.description,
            status=s.status.value,
            submitted_at=s.submitted_at,
            reviewed_at=s.reviewed_at,
            price_offer=s.price_offer,
            rejection_reason=s.rejection_reason
        )
        for s in submissions
    ]

@router.put("/submissions/{submission_id}/review")
async def review_submission(
    submission_id: int,
    status: str = Form(...),
    price_offer: Optional[float] = Form(None),
    rejection_reason: Optional[str] = Form(None),
    admin_notes: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """
    Review plant submission (admin only)
    """
    submission = db.query(PlantSubmission).filter(PlantSubmission.id == submission_id).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    try:
        submission.status = PlantSubmissionStatus(status)
        submission.reviewed_at = datetime.utcnow()
        submission.price_offer = price_offer
        submission.rejection_reason = rejection_reason
        submission.admin_notes = admin_notes
        
        db.commit()
        
        # TODO: Send notification to user about review result
        
        return {
            "message": "Submission reviewed successfully",
            "submission_id": submission_id,
            "status": status
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to review submission: {str(e)}")

@router.get("/quality-standards")
async def get_quality_standards():
    """
    Get quality standards for plant submissions
    """
    return {
        "standards": [
            {
                "id": "rare",
                "title": "Rare and in-demand varieties",
                "description": "We prioritize rare plant varieties that are in high demand",
                "examples": ["Monstera Albo", "Philodendron Pink Princess", "Anthurium Crystallinum"]
            },
            {
                "id": "healthy",
                "title": "100% healthy condition",
                "description": "Plants must be free from diseases, pests, and major damage",
                "examples": ["No yellow leaves", "No root rot", "No pest infestation"]
            },
            {
                "id": "size",
                "title": "Market-appropriate size",
                "description": "Size should match current market demand",
                "examples": ["6-8 inches for small plants", "12-18 inches for medium plants"]
            },
            {
                "id": "seasonal",
                "title": "Seasonal market demand",
                "description": "Plants should align with current seasonal demand",
                "examples": ["Indoor plants in winter", "Outdoor plants in spring"]
            }
        ],
        "rejection_reasons": [
            "Common variety with low market demand",
            "Health issues detected",
            "Size not suitable for current market",
            "Seasonal mismatch",
            "Photos don't match description",
            "Quality below our standards"
        ]
    }

@router.get("/market-insights")
async def get_market_insights():
    """
    Get current market insights for sellers
    """
    return {
        "high_demand_plants": [
            {
                "species": "Monstera Albo",
                "current_price": "฿8,000 - ฿15,000",
                "demand_level": "Very High",
                "reason": "Rare variegation, social media trend"
            },
            {
                "species": "Philodendron Pink Princess",
                "current_price": "฿6,000 - ฿12,000",
                "demand_level": "High",
                "reason": "Unique pink variegation, collector favorite"
            },
            {
                "species": "Anthurium Crystallinum",
                "current_price": "฿4,000 - ฿8,000",
                "demand_level": "High",
                "reason": "Beautiful foliage, growing popularity"
            }
        ],
        "seasonal_trends": [
            {
                "season": "Winter (Dec-Feb)",
                "trend": "High demand for indoor plants",
                "reason": "Holiday season, home decoration"
            },
            {
                "season": "Spring (Mar-May)",
                "trend": "Outdoor and garden plants",
                "reason": "Gardening season, outdoor activities"
            }
        ],
        "size_preferences": [
            {
                "size": "Small (4-6 inches)",
                "demand": "Medium",
                "price_range": "฿500 - ฿2,000",
                "reason": "Good for beginners, space-efficient"
            },
            {
                "size": "Medium (8-12 inches)",
                "demand": "High",
                "price_range": "฿2,000 - ฿8,000",
                "reason": "Perfect balance of size and price"
            },
            {
                "size": "Large (14+ inches)",
                "demand": "Medium",
                "price_range": "฿8,000 - ฿25,000",
                "reason": "Statement pieces, mature plants"
            }
        ]
    } 