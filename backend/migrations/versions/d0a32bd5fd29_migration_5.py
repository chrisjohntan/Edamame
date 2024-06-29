"""Migration 5

Revision ID: d0a32bd5fd29
Revises: db2dab544fce
Create Date: 2024-06-29 22:16:02.905786

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd0a32bd5fd29'
down_revision = 'db2dab544fce'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cards', schema=None) as batch_op:
        batch_op.add_column(sa.Column('forgot_multiplier', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('hard_multiplier', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('okay_multiplier', sa.Float(), nullable=True))
        batch_op.add_column(sa.Column('easy_multiplier', sa.Float(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('cards', schema=None) as batch_op:
        batch_op.drop_column('easy_multiplier')
        batch_op.drop_column('okay_multiplier')
        batch_op.drop_column('hard_multiplier')
        batch_op.drop_column('forgot_multiplier')

    # ### end Alembic commands ###
