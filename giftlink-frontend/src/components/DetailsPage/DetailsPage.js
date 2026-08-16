import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            navigate('/app/login');
            return;
        }

        const fetchGift = async () => {
            try {
                const response = await fetch(urlConfig.backendUrl + '/api/gifts/' + productId);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (fetchError) {
                setError(fetchError.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();
        window.scrollTo(0, 0);
    }, [navigate, productId]);

    const handleBackClick = () => {
        navigate(-1);
    };

    if (loading) {
        return <div className="container mt-5">Loading...</div>;
    }

    if (error) {
        return <div className="container mt-5 alert alert-danger">Error: {error}</div>;
    }

    if (!gift) {
        return <div className="container mt-5 alert alert-warning">Gift not found.</div>;
    }

    const comments = Array.isArray(gift.comments) ? gift.comments : [];

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card">
                <div className="card-header">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="image-placeholder-large">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="product-image-large" />
                                ) : (
                                    <div className="no-image-available-large">No Image Available</div>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Category:</strong> {gift.category}</p>
                            <p><strong>Condition:</strong> {gift.condition}</p>
                            <p><strong>Date Added:</strong> {gift.date_added}</p>
                            <p><strong>Age:</strong> {gift.age_days} days</p>
                            <p><strong>Description:</strong> {gift.description}</p>
                        </div>
                    </div>
                    <div className="comments-section">
                        <h3>Comments</h3>
                        {comments.length === 0 ? (
                            <p>No comments available.</p>
                        ) : (
                            comments.map((comment, index) => (
                                <div className="comment" key={comment.id || index}>
                                    <p className="comment-author"><strong>{comment.author}:</strong></p>
                                    <p className="comment-text">{comment.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailsPage;
