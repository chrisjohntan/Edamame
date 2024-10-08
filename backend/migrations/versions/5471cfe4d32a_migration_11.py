"""Migration 11

Revision ID: 5471cfe4d32a
Revises: 3ceaeade1246
Create Date: 2024-07-08 14:58:51.619276

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5471cfe4d32a'
down_revision = '3ceaeade1246'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cards', schema=None) as batch_op:
        batch_op.add_column(sa.Column('new', sa.Boolean(), nullable=True))
        batch_op.add_column(sa.Column('steps', sa.Integer(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cards', schema=None) as batch_op:
        batch_op.drop_column('new')
        batch_op.drop_column('steps')

    # ### end Alembic commands ###
